# infinite-scroller
Simple infinite scroll

**Note: Code is functional, but I need to write some documentation and demos. To follow shortly...**

Install as follows if you are using Browserify:

```npm install infinite-scroller --save```

or if not, simply include the JS file (It will expose a `window.InfiniteScroller` global if Browserify is not detected)

Demos available at [http://andymantell.github.io/infinite-scroller/](http://andymantell.github.io/infinite-scroller/)

There are no dependencies apart from that it expects a `Promise` implementation to be available either natively or via a polyfill. If you don't have this already, [`es6-promise`](https://github.com/jakearchibald/es6-promise) is great. If you *don't want* a `Promise` implementation in your application, then this plugin is not for you!

## TODO:

* Handle the last page properly - i.e. `resolve` the request promise with `false` and then disable infinite scrolling.
* Catch promise rejections from the request handler and do something useful with them
* Add in history management with `history.replaceState` so that when clicking away and returning to the list page, you are returned to the same place you are left off.
* history & URL management to allow deep linking into subsequent pages
* Make sure the plugin works in situations where the page already contains the first set of results in the DOM - i.e. a no-JS fallback.
* Add JSHint and JSCS validation
* Test suite and TravisCI badge
* Make it fail gracefully in IE8. Or support IE8, depending on my mood.

## Basic usage
```
var targetElement = document.querySelector('.my-target-element');

var infiniteScrollerInstance = new InfiniteScroller(targetElement, {
  request: function(page) {
    return new Promise(function(resolve, reject) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {

            // Resolve the promise with an HTML string representing the items to be added
            // Either directly from the AJAX request, or if your request returns JSON just render
            // it here and then return the HTML.
            resolve(httpRequest.responseText);
          } else {
            reject('There was a problem with the request.');
          }
        }
      };

      httpRequest.open('GET', '/whatever/example-api/results?page=' + page);
      httpRequest.send();
    });
  }
});

infiniteScrollerInstance.init()
```
