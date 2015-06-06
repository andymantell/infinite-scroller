# infinite-scroller
Simple infinite scroll

**Note: Code is functional, but I need to write some documentation and demos. To follow shortly...**

Install as follows if you are using Browserify:

```npm install infinite-scroller --save```

or if not, simply include the JS file (It will expose a `window.InfiniteScroller` global if Browserify is not detected)

Demos available at [http://andymantell.github.io/infinite-scroller/](http://andymantell.github.io/infinite-scroller/)

There are no dependencies apart from that it expects a `Promise` implementation to be available either natively or via a polyfill. If you don't have this already, [`es6-promise`](https://github.com/jakearchibald/es6-promise) is great. If you *don't want* a `Promise` implementation in your application, then this plugin is not for you!
