# Fixed-sticky: a CSS `position:sticky` polyfill

- (c)2013 @zachleat, Filament Group
- MIT license

## Explanation

CSS position:sticky is really in its infancy in terms of browser support. In stock browsers, it is currently only available in iOS 6. In Chrome you can enable it by navigating to `chrome://flags` and enabling experimental “WebKit features” or “Web Platform features” (Canary).

## Usage

Just qualify element you’d like to be `position:sticky` with a `fixedsticky` class and add your own CSS to position the element.

    .fixedsticky { top: 0; }

See [`demo.html`](http://filamentgroup.github.com/fixed-sticky/demo.html) for an example.

## Installation

Use the provided `fixedsticky.js` and `fixedsticky.css` files.

### Also available in [Bower](http://bower.io/)

    bower install filament-sticky

## TODO

* Add support for container-based position: sticky. Only constrains to the document right now.
* Add support for `bottom` positioning. Supports only top right now.
* Tests (of course). I have a serious case of developer guilt releasing this without tests.

## Release History

* `v0.1.0`: Initial release.