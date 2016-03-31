h1. jQuery Smartify Library for Smart Web

jQuery Smartify loads images, calls Ajax, plays with css classes in on demand, while element is/or becoming visible in device Viewport.

h2. Getting Started

Smartify is a jQuery Plugin. So, you will required to include jQuery too. Include them both in end of your HTML code before <strong>&lt;/body&gt;</strong>:

<pre>
	&lt;script src=&quot;jquery.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;jquery.smartify.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;
</pre>

All elements to take control by Smartify required to add a class value `.smartify` and some other attributes:

<strong>For Example</strong>

<pre><img class="smartify" sm-src="img/example.jpg" width="640" height="480"></pre>

then in your code do:

<pre>$(".smartify").smartify();</pre>

This causes all images of class lazy to be lazy loaded.

h3. Releases

- **1.0.0-rc:** Release candidate of the Plugin
