# Fixed-sticky [![Build Status](https://travis-ci.org/filamentgroup/fixed-sticky.svg?branch=master)](https://travis-ci.org/filamentgroup/fixed-sticky)

A CSS `position:sticky` polyfill.

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

- ©2013 [@zachleat](https://github.com/zachleat), Filament Group
- MIT license

## Explanation

CSS position:sticky has spotty support across browsers. Apple Safari supports it as the prefixed `position: -webkit-sticky;` from OSX/iOS Safari 6.1+, Firefox supports it un-prefixed in v32+. Chrome does not currently support it (although it was in pre-blink canary behind a flag, and may return in the future). For more on the current state of native support, visit [CanIUse](http://caniuse.com/#feat=css-sticky).

This is a polyfill to achieve the same effect in other browsers, eg, IE9+, Chrome and Android.

## Dependancies

- jQuery 1.7+
- Read the positioning caveats below.

## Basic usage

Add jQuery and fixedsticky JS/CSS to the page, or install via bower:

    bower install filament-sticky

It's recommended that you add JS before the close of the body tag, unless you're fixing the sticky element to the bottom of the container and do not wish to see a jump on page load. CSS should be in the head, unless you have an async CSS strategy.

    <!-- IN HEAD TAG -->
    <link rel="stylesheet" href="/js/fixedsticky.css" type="text/css" media="all">
    <!-- BEFORE CLOSING BODY TAG -->
    <script src='https://code.jquery.com/jquery-1.11.2.min.js'></script>
    <script src='/js/fixedsticky.js'></script>

Qualify the element(s) you’d like to be `position:sticky` with a `fixedsticky` class.

    <div class="fixedsticky">

Add your own CSS to position the element.

    .fixedsticky { top: 0; }

The container element must not have `overflow:hidden;` and must not be `position:static;`

    .my-container { position: relative; overflow: visible; }

Next, initialize your sticky nodes:

    $( '.fixedsticky' ).fixedsticky();

## Demos
* [Basic "sticky address book header" scenario](demos/demo-2-address-book.html).
* [Basic "sticky sidebar" scenario](demos/demo-2-sidebar.html).
* [Multiple instances on the same page](demos/demo-2-multiple-insances.html).
* [Overriding native support to achieve 'stick to bottom'](demos/demo-2-stick-to-bottom.html).
* [Using the pre-scroll offset to get around with an unrelated fixed header](demos/demo-2-pre-scroll.html).
* The original filament group demo (for reference): [`demo.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo.html).
* The original filament group native position demo (for reference): [`demo-control.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo-control.html).
* The original filament group native-override demo (for reference): [`demo-opt-out-native.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo-opt-out-native.html).

## Caveats

* Browsers that support sticky natively only support sticking to the top of a container, not the bottom (if you want to use this polyfill to overcome this, see below).
* If you’re going to use non-zero values for `top` or `bottom`, fixed-sticky is victim to a cross-browser incompatibility with jQuery’s `css` method (namely, IE8- doesn’t normalize non-pixel values to pixels). Use pixels (or `0`) for best cross-browser compatibility.
* `sticky` elements are constrained to the dimensions of their parents. This plugin behaves the same.
* Any non-default value (not `visible`) for `overflow`, `overflow-x`, or `overflow-y` on the parent element will disable `position: sticky` (via [@davatron5000](https://twitter.com/davatron5000/status/434357818498351104)).
* iOS does not support `position: sticky;` with `display: inline-block;`.
* This plugin does not (yet) support use with `thead` and `tfoot`.
* Native `sticky` anchors to parent elements using their own overflow. This means scrolling the element fixes the sticky element to the parent dimensions. This plugin does not support overflow on parent elements.

### Styling options for native vs polyfilled clients

To enable you to offer different styling options for progressive enhancement, the polyfill adds appropriate classes to the root `html` element:
* `fixedsticky-native` where native support is available.
* `fixedsticky-polyfilled` where the polyfill has successfully initialised for at least one element.
* both of the above where native support is available but has been optionally overidden by the polyfill (as outlined below)
* neither of the above where native support is unavailable and the polyfill can not be (or has failed to be) initialised.

### Sticking items to the bottom of a container

If you wish to stick an element to the bottom of a container (eg, a promobox to the bottom of a sidebar), set the element CSS as having a `bottom: 0;` instead of the regular `top: 0;`. However, native implementations don't currently support this, so you may want to override the native behavior with this polyfill, as described below.

* See [this demo for an example of sticking to the bottom of a container](demos/demo-2-stick-to-bottom.html).

### Using the polyfill instead of native

If you’re having weird issues with native `position: sticky`, you can tell fixed-sticky to use the polyfill instead of native. Just override the sticky feature test to always return false. Make sure you do this before any calls to `$( '#my-element' ).fixedsticky();`.

    // After fixed-sticky.js
    FixedSticky.tests.sticky = false;

* See [this demo for an example of overriding native implementation](demos/demo-2-stick-to-bottom.html).

### Options

Apart from setting the element to stick to either the top or bottom (achieved by setting the CSS of `top:` or `bottom:` as described above), there is only one more optional setting, the *pre-scroll offset*. By default, the element starts to go into *"sticky mode"* when page scrolling means it's offset is crossing the top of the window or viewport. But sometimes you want the element to start becoming sticky before that point. For example, if you have a 100px high navigation bar fixed to the top of the window, you would want a sidebar to become sticky at least 100px before it crosses the top of the viewport. You can achieve this by adding a data attribute to the sticky element:

    <div class="fixedsticky" data-fixedstickyprescrolltop="100">

Note the value is always in pixels and an integer.
* See [this demo for an example of adding a pre-scroll offset](demos/demo-2-pre-scroll.html).

### Accessing FixedSticky in javascript

You can access the fixedsticky object - including config and methods. eg:

    FixedSticky.init('#my-element')

### Removing sticky positioning

You can remove the fixedsticky polyfill behavior from any element using:

    FixedSticky.destroy('#my-element')

This will remove the polyfill and all it's associated data and classes from the element (but not the `.fixedsticky` class). Be aware that browsers that support sticky natively will still do so after the polyfill is removed, unless you take steps to stop it. If *the last instance* of a polyfilled element has been unitialised, the window scroll and resize events will also be removed and the `HTML` tag will have the `fixedsticky-polyfilled` CSS class removed.
    
## Browser Support

These tests were performed using fixed-sticky with the Filament group fixed-fixed polyfill. It’s safest to use them together (`position:fixed` is a minefield on older devices), but they can be used independently.

* **Native Sticky**
    * OSX Safari 6.1+ (prefixed), iOS 6.1+ (prefixed), Firefox 32+ (un-prefixed)
* **Polyfilled**
    * Internet Explorer 7, 8, 9, 10
    * Firefox 24, Firefox 17 ESR
    * Chrome 29
    * Safari 6.0.5
    * Opera 12.16
    * Android 4.X
* **Fallback (static positioning)**
    * Android 2.X
    * Opera Mini
    * Blackberry OS 5, 6, 7
    * Windows Phone 7.5

### A brief overview of the internals

So that you don't have to go through the code to find out exactly how it works, here are some points that may help in your debugging.
- The class `.fixedsticky doesn't control the polyfill initialisation (you use the more specific `$('#my-element').fixedsticky();`), but it is used in the polyfill CSS.
- There are three modes (and three CSS classes) that a sticky element can be in:
    - **initial**: ie, the natural resting position of the element, eg for top-anchored element, it's the static/relative position at the top of it's container.
    - **sticky**: ie, where the element is now floating as the page scrolls, achieved with fixed positioning.
    - **opposite**: ie the page has scrolled to the point that the sticky element has hit the opposite end of it's container, and is locked to that end using absolute positioning.
- On intialisation, a cloned block is added after the sticky element. It's purpose is to stop the content below the sticky element jumping up when it turns from static/relative positioning to fixed positioning. As such, it remains undisplayed until the sticky element becomes fixed (ie, sticky mode), and the clone block has `display:none` removed, but only takes up space as it also has `visibility:hidden`.
- On intialisation, events are attached to the scroll and resize events called window.scroll.fixedsticky and window.resize.fixedsticky. If either of these are removed - even if they are then added back - the binding with exsiting sticky elements will break.
- The config, dimensions, rest positions and state of each sticky element is held in the jQuery data() object on that element. This allows multiple instances to be added to a page.

## TODO

* Add support for table headers.
* Vanilla JS version.
* Decide on the best approach for responsive design, either JS config or overriding CSS rules.

## [Tests](http://filamentgroup.github.io/fixed-sticky/test/fixed-sticky.html)

## Release History

* `v0.1.0`: Initial release.
* `v0.1.3`: Bug fixes, rudimentary tests, destroy method.
