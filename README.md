# infinite-scroller
Simple infinite scroll

**Note: Code is functional, but I need to write some documentation and demos. To follow shortly...**

Install as follows if you are using Browserify:

```npm install infinite-scroller --save```

or if not, simply include the JS file (It will expose a `window.InfiniteScroller` global if Browserify is not detected)

Demos available at [http://andymantell.github.io/infinite-scroller/](http://andymantell.github.io/infinite-scroller/)

There are no dependencies apart from that it expects a `Promise` implementation to be available either natively or via a polyfill. If you don't have this already, [`es6-promise`](https://github.com/jakearchibald/es6-promise) is great. If you *don't want* a `Promise` implementation in your application, then this plugin is not for you!

## Basic usage
```
var targetElement = document.querySelector('ul.my-target-element');

var infiniteScrollerInstance = new InfiniteScroller(targetElement, {
  request: function(page) {
    return new Promise(function(resolve, reject) {
      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            resolve(render(httpRequest.responseText));
          } else {
            reject('There was a problem with the request.');
          }
        }
      };

      httpRequest.open('GET', '/whatever/example-api/results');
      httpRequest.send();
    });
  }
});

infiniteScrollerInstance.init()
```


## TODO:

* Consider disabling the infinite scrolling while pages are loading - at the moment if you hold down the END key it loads page after page and goes a bit mad
* Add in history management with `history.replaceState` so that when clicking away and returning to the list page, you are returned to the same place you are left off.
* Make sure the plugin works in situations where the page already contains the first set of results in the DOM - i.e. a no-JS fallback.
* Test suite
* Make it fail gracefully in IE8. Or support IE8, depending on my mood.
