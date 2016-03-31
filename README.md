# jQuery Smartify

jQuery Smartify boosts web application load times and lazy loads images, calls Ajax, plays with css classes in/on demand, while element is/or being visible in device viewport.

It has full capability of [jQuery Lazyload](https://github.com/tuupola/jquery_lazyload), but with more elements coverage and advanced. This doesn't only work for &lt;img&gt;, have capabality to smartify any elements!

Plugin is inspired by [jQuery Lazyload](https://github.com/tuupola/jquery_lazyload) created by [Mika Tuupola](https://github.com/tuupola).

### Features, Benefits & Plans

- [x] Boost your web application load time.
- [x] Multiple Elements Support
- [x] Dynamically load contents via Ajax call. e.g: Load each section on just before becoming visible.
- [x] Infinite load items, such as products to sale. Best for e-commerce websites.
- [x] Load images when visible in viewport.
- [x] Load dynamic images for different DPI supports. Such as 3x for High Res(Retina) display.
- [x] Toggle, Add or Remove element classes.
- [x] Or just call User defined callback function.
- [ ] HTML5 History API (wip)

## Getting Started

Preferred method:
* Install with [Bower]: `$ bower install smartify`

Other methods:
* [Download zipball of latest release][zipball].
* Download the latest production or development files individually:
  * *[min]* (Production version)
  * *[max]* (Development version)

**Note:** *jquery.smartify.js* have a dependency on [jQuery]

<!-- section links -->

[Bower]: http://bower.io/
[zipball]: https://github.com/vinaykrsharma/jquery.smartify/archive/1.0.0.zip
[jQuery]: http://jquery.com/
[min]: https://raw.github.com/vinaykrsharma/jquery.smartify/master/dist/jquery.smartify.min.js
[max]: https://raw.github.com/vinaykrsharma/jquery.smartify/master/dist/jquery.smartify.js


Quick Start
-----------

```html
<!-- Elements to Smartify -->
<img class="smartify" sm-src="/static/path/to/img.png">

...

<!-- JavaScript before </body> -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="dist/jquery.smartify.min.js"></script>
<script>
jQuery(function($) {
  $('.smartify').smartify(); // "smartify"
});
</script>
```

Examples
--------

For some working examples of Smartify, visit the [examples page].

<!-- section links -->

[examples page]: http://www.vinay-sharma.com/jquery-plugins/jquery.smartify/demo.html


Documentation
-------------

[Docs](http://www.vinay-sharma.com/jquery-plugins/jquery.smartify)

Browser Support
---------------

Manually Tested Platforms on Linux and Mac OS X only ()

* Chrome (Linux/Mac OS X/Android 5.1+)
* Firefox 40+ (Linux/Mac OS X/Android 5.1+)
* Safari 5+ (Mac OS X)
* Opera 11+  (Linux/Mac OS X/Android 5.1+)

Issues
------

Discovered a bug? Please create an issue here on GitHub!

https://github.com/vinaykrsharma/jquery.smartify/issues

Versioning
----------

For transparency and insight into our release cycle, releases will be numbered 
with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.
