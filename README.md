# Fixed-sticky

## 🚨🚨 This plugin is Deprecated 🚨🚨

In our own designs we use sticky sparingly and as an enhancement, which means that fallback positioning behavior is acceptable. With [native browser support for `position: sticky`](http://caniuse.com/#feat=css-sticky) expanding, we must weigh the diminishing cross-section of browsers that require this polyfill against this plugin’s own maintenance costs. Therefore, we’ve decided that now is the right time to retire `fixed-sticky`. The [previous documentation can be found at v0.1.7](https://github.com/filamentgroup/fixed-sticky/tree/cd752571b89d0dcc0d2783feb8dda43cf4ff259d). NPM will report a deprecation warning. If you want to maintain a fork of this package, send me a message ([@zachleat on Twitter](https://twitter.com/zachleat)) and I’ll add a link to it below. **Thank you!**

[![Filament Group](https://www.filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

- ©2013 [@zachleat](https://github.com/zachleat), Filament Group
- MIT license

### Great alternatives

* [Stickybits](https://github.com/dollarshaveclub/stickybits) from Dollar Shave Club and [Jeff Wainwright](https://twitter.com/yowainwright)

## Native position: sticky

The most overlooked thing about `position: sticky` is that `sticky` elements are constrained to the dimensions of their parent elements. This means if a `sticky` element is inside of a parent container that is the same dimensions as itself, the element will not stick.

Here’s an example of what a `sticky` element with CSS `top: 20px` behaves like:

![](demos/gifs/sticky-top-off.gif)

*Scrolling down.* The blue border represents the dimensions of the parent container element. If the element’s top is greater than `20px` to the top of the viewport, the element is not sticky.

![](demos/gifs/sticky-top-on.gif)

*Scrolling down.* When the element’s top is less than `20px` to the top of the viewport, the element is sticky.

Here’s an example of what a `sticky` element with CSS `bottom: 20px` behaves like:

![](demos/gifs/sticky-bottom-off.gif)

*Scrolling up.* Not sticky.

![](demos/gifs/sticky-bottom-on.gif)

*Scrolling up.* Sticky.

## Demos
* To test pure native position: sticky test, open [`demo-control.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo-control.html).

## Native `position: sticky` Caveats

* Any non-default value (not `visible`) for `overflow`, `overflow-x`, or `overflow-y` on the parent element will disable `position: sticky` (via [@davatron5000](https://twitter.com/davatron5000/status/434357818498351104)).
* iOS ~~(and Chrome)~~ do not support `position: sticky;` with `display: inline-block;`.
* This plugin ~~(and Chrome’s implementation)~~ does not support use with `thead` and `tfoot`.
* Native `sticky` anchors to parent elements using their own overflow. This means scrolling the element fixes the sticky element to the parent dimensions. This plugin does not support overflow on parent elements.
