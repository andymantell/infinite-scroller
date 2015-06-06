'use strict';

/**
 * Infinite Scroll
 * @param {Element} element Target DOM element
 * @param {Object}  config  Configuration object
 */
function InfiniteScroller(element, config) {

    // Private variables
    var currentPage = 0;
    var state = {
        pages: {}
    };
    var scrollTimeout = null;

    // Default options
    var options = {
        placeholderClass: 'placeholder',

        /**
         * AJAX request handler. When instantiating this module this function should
         * @param  {Number} page Page number to fetch. 1 based.
         * @return {Promise}     Promise which should resolve with the HTML to be appended to the main element
         */
        request: function(page) {
            return new Promise(function(resolve, reject) {
                resolve('<p>Please override <code>options.request</code> when instantiating this plugin</p>');
            });
        },

        /**
         * Callback which can be used to process the returned results before they are put in the DOM
         * @param  {DocumentFragment} results Collection of DOM items
         */
        processResults: function(results) {

        }
    };

    // Lightweight extend to avoid dependency on a deep extend function
    options.forEach(function(item, index) {
        if(typeof(config[index]) !== 'undefined') {
            options[index] = config[index];
        }
    });

    /**
     * Init method
     */
    function init() {
        loadInitialBatch();

        // Bind a scroll listener which we'll use to trigger new pages to load
        window.addEventListener('scroll', scrollListener);
    }

    /**
     * Private helper method to load an initial batch of results
     */
    function loadInitialBatch() {
        // For as long as the bottom of the element is visible, let's request pages to fill up the viewport
        requestNextPage()
            .then(function() {
                if(pageAtBottom()) {
                    loadInitialBatch();
                }
            });
    }

    /**
     * Private method to request the next page of results
     */
    function requestNextPage() {
        var page = ++currentPage;

        // Pop a placeholder in the DOM straight away which we will replace with
        // the results later
        // Otherwise, if multiple pages got requested in quick succession, there
        // would be a race condition which could result in the pages being
        // appended to the DOM out of order.
        var placeholder = document.createElement('div');
        placeholder.classList.add(options.placeholderClass);
        element.appendChild(placeholder);

        // Get the next page and append the results to the DOM
        var promise = getPage(page)
            .then(function(results) {

                // Fire off our callback to process the results
                // Used by the product listing to add adverts
                options.processResults(results);

                element.replaceChild(results, placeholder);
            });

        // Pre-fetch the page after that, but don't do anything with the results
        getPage(++page);

        return promise;
    }

    /**
     * Private method to get a page of results
     * @param  {Number} requestedPage Page number to fetch
     * @return {Promise}              Promise that resolves when the request is complete
     */
    function getPage(requestedPage) {
        return new Promise(function(resolve, reject) {

            // If we have already fetched this page, send it right back
            if(state.pages[requestedPage]) {
                resolve(state.pages[requestedPage]);
            } else {
                // Fire off a request using the passed in handler
                options.request(requestedPage)
                    .then(function(html) {

                        // And then append the resulting items to the DOM
                        // We will do this via a document fragment in order to keep DOM manipulation to a minimum
                        var fragment = document.createDocumentFragment();
                        var temp = document.createElement('div');

                        // Pop the html into a temporary element before slurping it out again as you cannot use innerHTML on a document fragment
                        temp.innerHTML = html;
                        while (temp.hasChildNodes()) {
                            fragment.appendChild(temp.removeChild(temp.firstChild));
                        }

                        // Store the fragment on our state object
                        state.pages[requestedPage] = fragment;

                        // And then return the fragment
                        resolve(fragment);
                    });
            }

        });
    }

    /**
     * Scroll event listener to trigger new page loads
     * @param  {Event} e The scroll event
     */
    function scrollListener(e) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if(pageAtBottom()) {
                requestNextPage();
            }
        }, 100);
    }

    /**
     * Helper method to determine if the page is at the bottom
     * @return {Boolean} Boolean representing whether the page is at the bottom
     */
    function pageAtBottom() {
        return (element.getBoundingClientRect().bottom - 50) < (window.pageYOffset + window.innerHeight);
    }

    /**
     * Public method to reset the product list
     */
    function reset() {
        currentPage = 0;

        state = {
            pages: {}
        };

        element.innerHTML = '';

        loadInitialBatch();
    }

    /**
     * Tear everything down again
     */
    function destroy() {
        window.removeEventListener('scroll', scrollListener);
    }

    /**
     * Public methods
     */
    var self = {
        init: init,
        reset: reset,
        destroy: destroy
    };

    return self;
}

// Expose as a CommonJS module for browserify
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteScroller;
  } else {
    // Otherwise expose as a global for non browserify users
    window.InfiniteScroller = InfiniteScroller;
  }
