# Fixed-sticky: a CSS `position:sticky` polyfill

- (c)2013 @zachleat, Filament Group
- MIT license

## Explanation

CSS position:sticky is really in its infancy in terms of browser support. In stock browsers, it is currently only available in iOS 6. In Chrome you can enable it by navigating to `chrome://flags` and enabling experimental “WebKit features” or “Web Platform features” (Canary).

## Usage

Just qualify element you’d like to be `position:sticky` with a `fixedsticky` class.

    <div id="my-element" class="fixedsticky">

Add your own CSS to position the element.

    .fixedsticky { top: 0; }

Next, add the events and initialize your sticky nodes:

    $( '#my-element' ).fixedsticky();

See [`demo.html`](http://filamentgroup.github.com/fixed-sticky/demo.html) for an example.

## Installation

Use the provided `fixedsticky.js` and `fixedsticky.css` files.

### Also available in [Bower](http://bower.io/)

    bower install filament-sticky

## Browser Support

These tests were performed using fixed-sticky with fixed-fixed. It’s safest to use them together (`position:fixed` is a minefield on older devices), but they can be used independently.

### Native Sticky

* iOS 7

### Polyfilled

* Internet Explorer 7, 8, 9, 10
* Firefox 24
* Chrome 29
* Safari 6.0.5
* Opera 12.16
* Android 4.X

### Fallback (static positioning)

* Android 2.X
* Opera Mini

## TODO

* Tests (of course). I have a serious case of developer guilt releasing this without tests.
* Add support for table headers.
* Test support on Windows Phone and older Blackberry.

## Release History

* `v0.1.0`: Initial release.