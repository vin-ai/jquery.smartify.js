# jQuery Smartify

jQuery Smartify turns all element to load images, content in on demand while page scrolling and element is/or becoming visible in device Viewport.

It's an alternate of [jQuery Lazyload](https://github.com/tuupola/jquery_lazyload), but with more elements coverage and advanced. This doesn't only work for &lt;img&gt;, have capabality to smartify every thing!

Plugin is inspired by [jQuery Lazyload](https://github.com/tuupola/jquery_lazyload) created by [Mika Tuupola](https://github.com/tuupola).

### Plans & Features

- [ ] Multiple Elements Support
- [ ] Retina Support
- [ ] Element.getBoundingClientRect() support

### Example:

```javascript
$(".smartify").smartify({
    threshold: 200,
    appear: function ($element, settings) {
        console.log('Appear Called:');
        console.log($element);
    },
    load: function ($element, settings) {
        console.log('Load Called:');
        console.log($element);
    }
});
```
