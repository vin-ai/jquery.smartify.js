# jQuery Smartify

jQuery Smartify boosts web application load times and loads images, calls Ajax, plays with css classes in/on demand, while element is/or being visible in device Viewport.

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

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/vinaykrsharma/jquery.smartify/master/dist/jquery.smartify.min.js
[max]: https://raw.github.com/vinaykrsharma/jquery.smartify/master/dist/jquery.smartify.js

In your web page:

```html
<!--
Elements to Smartify
-->
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

## Documentation

[Docs](http://www.vinay-sharma.com/jquery-plugins/jquery.smartify)

## Examples

[See Examples Here](http://www.vinay-sharma.com/jquery-plugins/jquery.smartify/demo.html)

## Release History

- 1.0.0-rc First Release of the plugin

