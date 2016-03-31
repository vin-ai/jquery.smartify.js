/**
 * jQuery Smartify
 * http://www.vinay-sharma.com/jquery-plugins/jquery.smartify
 *
 * Copyright VINAY KUMAR SHARMA
 * Released under the MIT license
 * http://www.vinay-sharma.com/jquery-plugins/license/
 *
 * @author Vinay Kumar Sharma <vinaykrsharma@live.in>
 * @desc A smart plugin triggers defined action/event
 * when elements are visible in the viewport of device.
 * @version 1.0.0
 */
(function ($, window, undefined) {
    // window object to calculate width, height and bind scroll event
    var $window = $(window);

    // Container element, where Smartify will look for elements
    var $container = $window;

    // If device supports `devicePixelRation`, else default will be 1
    var device_pixel_ration = window.devicePixelRatio || 1;

    // This variable will be used to load high res images for high res device
    var multiple_for_dpr = null;

    var log = console && console.log ? function (d, s) {
        console.log(d, s || '');
    } : $.noop;

    $.fn.smartify = function (options) {
        var elements = this;
        var settings = {
            // Trigger action just before nth pixels of element
            threshold: 0,
            // Limit the reload try of sources for images or Ajax
            limit_retry: 0,
            // Trigger the action of elements on container event
            event: "scroll",
            // Effect to be apply on element after source successfully loaded
            effect: "fadeIn",
            // Container to bind defined `event`
            container: window,
            // Original source of the element to be loaded/called
            src_attr: "sm-src",
            // Load/call action if element is actually visible in viewport or even invisible after appeared in viewport
            skip_invisible: true,
            // Default image source to be placed after plugin initialized to all smartify elements
            placeholder: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTEwNTEuMzYyMikiIC8+PC9zdmc+",
            // Callback functions
            // Calls when element is/or being visible in viewport
            appear: $.noop,
            // Calls when source URL loaded successfully to element
            load: $.noop
        };

        $.extend(settings, options || {});

        if (device_pixel_ration > 1) {
            // `src_attr` for normal
            // Retina support with combination of `src_attr` value
            // `src_attr`-1-5x
            // `src_attr`-2x
            // `src_attr`-3x
            multiple_for_dpr = settings.src_attr + "-" + (device_pixel_ration > 2 ? "3x" : (device_pixel_ration > 1.5 ? "2x" : "1-5x"));
        }

        if (multiple_for_dpr === null) {
            multiple_for_dpr = settings.src_attr;
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined || settings.container === window) ?
            $window : $(settings.container);

        var refresh = function () {
            var counter = 0;

            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.above_the_top(this, settings.threshold) ||
                    $.left_of_begin(this, settings.threshold)) {
                    /* Nothing. */
                } else if (!$.below_the_fold(this, settings.threshold) && !$.right_of_fold(this, settings.threshold)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.limit_retry) {
                        return false;
                    }
                }
            });

        };

        var remove_loaded_elements = function () {
            /* Remove current element from list so it can not be looped again. */
            var temp = $.grep(elements, function (element) {
                return !(element.loaded || element.no_src_attr);
            });
            elements = $(temp);
        };

        var toggle_classes = function ($element) {
            var toggle_class = $element.data("toggle-class");
            var add_class = $element.data("add-class");
            var remove_class = $element.data("remove-class");

            if (toggle_class) {
                $element.toggleClass(toggle_class);
            }
            if (remove_class) {
                $element.toggleClass(remove_class);
            }
            if (add_class) {
                $element.toggleClass(add_class);
            }
        };

        var load_for_image = function (element, element_settings, remove_this_element) {
            var $element = $(element);
            var src_original = $.trim($element.attr(element_settings.src_attr));

            if ($element.attr(multiple_for_dpr)) {
                src_original = $.trim($element.attr(multiple_for_dpr));
            }

            $("<img />").bind("load", function () {
                $element.hide();
                $element.attr("src", src_original);
                $element[element_settings.effect](element_settings.effect_speed);
                element.loaded = true;
                remove_this_element();
                element_settings.load(element, elements, element_settings);
            }).attr("src", src_original);
        };

        var load_for_iframe = function (element, element_settings, remove_this_element) {
            var $element = $(element);
            var src_original = $.trim($element.attr(element_settings.src_attr));

            if ($element.attr(multiple_for_dpr)) {
                src_original = $.trim($element.attr(multiple_for_dpr));
            }
            // bind onload event to iframe
            // to
            $element.on("load", function () {
                $element[element_settings.effect](element_settings.effect_speed);
                element.loaded = true;
                remove_this_element();
                element_settings.load(element, elements, element_settings);
            }).attr("src", src_original);
        };

        var load_for_anchor = function (element, element_settings, remove_this_element) {
            var $element = $(element);
            var url = $element.attr("href");
            var to_do = $element.data("do");
            var $target = $element.data("target");
            // If target is not a html tag not CSS selector,
            // but represents like function, call that function
            // and find target element
            if ($target === "callback()") {
                // Call toggle_classes to toggle defined classes on target element
                toggle_classes($element);

                element.loaded = true;
                remove_this_element();
                // Do not call load callback here, just need to call
                // `appear` callback, which already has been called
                // element_settings.load(element, elements, element_settings);
                //
                // and return
                return;
            } else if ($target === "parent()") {
                $target = $element.parent();
            } else if ($target) {
                $target = $($target);
            }

            if ($target.is("iframe")) {
                $target.attr(element_settings.src_attr, url);
                // just call `load_for_iframe` here
                load_for_iframe($target.get(0), element_settings, remove_this_element);
                // $target[element_settings.effect](element_settings.effect_speed);
                // Call toggle_classes to toggle defined classes on target element
                toggle_classes($target);
            } else if ($target.is("img")) {
                $target.attr(element_settings.src_attr, url);
                // just call `load_for_iframe` here
                load_for_image($target.get(0), element_settings, remove_this_element);
                // $target[element_settings.effect](element_settings.effect_speed);
                // Call toggle_classes to toggle defined classes on target element
                toggle_classes($target);
            } else {

                // More options from data attribute of $element
                var ajax_options = {
                    method: "GET",
                    url: url,
                    data: {}
                };
                $.ajax(ajax_options).done(function (responseText) {
                    if (to_do === "append") {
                        $target.appendChild(responseText);
                    } else {
                        $target.html(responseText);
                    }

                    $target[element_settings.effect](element_settings.effect_speed);
                    // Call toggle_classes to toggle defined classes on target element
                    toggle_classes($target);

                    element.loaded = true;
                    remove_this_element();

                    // Load ajax to target and smartify elements using defined css selector
                    if (element_settings.load_target_and_smartify && element_settings.elements_selector) {
                        $target.find(element_settings.elements_selector).smartify(settings);
                    }

                    element_settings.load(element, elements, element_settings, responseText);
                }).fail(function (jqXHR, textStatus) {
                    element_settings.load(element, elements, element_settings, jqXHR, textStatus);
                });
            }
        };

        /* Fire one scroll event per scroll. Not one scroll event per element. */
        if (settings.event.indexOf("scroll") === 0) {
            $container.bind(settings.event, function () {
                return refresh();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);
            //
            // clone to change for this element if some configurations
            // found in data attributes
            // and keep original unchanged for others
            var element_settings = $.extend({}, settings, $self.data());

            element_settings.threshold = parseInt(element_settings.threshold);

            //
            // Set default flags
            self.loaded = false;
            self.no_src_attr = false;
            var src = $.trim($self.attr("src")) || false;
            var src_original = $.trim($self.attr(element_settings.src_attr)) || false;
            //
            // Types
            var is_a = $self.is("a");
            var is_img = $self.is("img");
            var is_iframe = $self.is("iframe");

            if ($self.data("toggle-class") || $self.data("add-class") || $self.data("remove-class")) {
                // Copy class, just to prevent infinite recursion
                var prev_on_load = element_settings.load;
                element_settings.load = function (element, elements, element_settings, jqXHR, textStatus) {
                    prev_on_load(element, elements, element_settings, jqXHR, textStatus);
                    toggle_classes($self);
                };
            }

            // If img/iframe element has no/empty src attribute use placeholder till it loads original.
            if ((is_img || is_iframe) && !src) {
                $self.attr("src", element_settings.placeholder);
            }

            // If element is in the collection, but don't have value of `src_attr` attribute
            if ((is_img || is_iframe) && !src_original) {
                log("%cElement has no " + element_settings.src_attr + " defined to load",
                    "color: #ff9900;");
                // Remove element from array so it is not looped next time.
                self.no_src_attr = true;
                remove_loaded_elements();
                return;
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                // Return from here, if image is already loaded
                if (this.loaded) {
                    return;
                }

                // If after appear callback has defined
                // call the callback function with some parameters
                if (element_settings.appear) {
                    // pass the rest elements, so user can cook something on that
                    element_settings.appear(self, elements, element_settings);
                }

                if (is_img) {
                    load_for_image(self, element_settings, remove_loaded_elements);
                } else if (is_a) {
                    if ($self.data("target")) {
                        load_for_anchor(self, element_settings, remove_loaded_elements);
                    } else {
                        log("%cAn Anchor Tag must have defined data-target=\"\" attribute " +
                            "to load response content in!", "color: #ff9900;");
                    }
                } else if (is_iframe) {
                    load_for_iframe(self, element_settings, remove_loaded_elements);
                } else {
                    remove_loaded_elements();
                    element_settings.load(self, elements, element_settings);
                    // Here we will not work to load background image for an element
                    // If want so, the just use `data-add-class=""`. Where
                    // class will have to set background property
                    // e.g: <div class="smartify" data-add-class="bg-img"></div>
                }
            });

            if (element_settings.event.indexOf("scroll")) {
                $self.bind(element_settings.event, function () {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        // Because on viewport resize some elements could be visible
        // due to CSS3 @media query
        $window.bind("resize orientationchange", refresh);
        // Initial Smartify at document ready, prior to scroll
        $(window.document).ready(refresh);

        return this;
    };

    var container_top = function () {
        if (typeof $container.scrollTop === "function") {
            return $container.scrollTop();
        }
        return $container.offset().top;
    };

    var container_left = function () {
        if (typeof $container.scrollLeft === "function") {
            return $container.scrollLeft();
        }
        return $container.offset().left;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.below_the_fold(element, 100) */
    $.below_the_fold = function (element, threshold) {
        return $container.height() + container_top() <= $(element).offset().top - threshold;
    };

    $.right_of_fold = function (element, threshold) {
        return $container.width() + container_left() <= $(element).offset().left - threshold;
    };

    $.above_the_top = function (element, threshold) {
        return container_top() >= $(element).offset().top + threshold + $(element).height();
    };

    $.left_of_begin = function (element, threshold) {
        return container_left() >= $(element).offset().left + threshold + $(element).width();
    };

    $.visible_in_viewport = function (element, threshold) {
        return !($.right_of_fold(element, threshold) &&
        $.left_of_begin(element, threshold) &&
        $.below_the_fold(element, threshold) &&
        $.above_the_top(element, threshold));
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:visible-in-viewport").something() or */
    /* $("img").filter(":visible-in-viewport").something() which is faster */
    $.extend($.expr[":"], {
        "visible-in-viewport": function (a) {
            return $.visible_in_viewport(a, 0);
        },
        "below-the-fold": function (a) {
            return $.below_the_fold(a, 0);
        },
        "above-the-top": function (a) {
            return !$.below_the_fold(a, 0);
        },
        "right-of-screen": function (a) {
            return $.right_of_fold(a, 0);
        },
        "left-of-screen": function (a) {
            return !$.right_of_fold(a, 0);
        }
    });

    /**
     * jQuery Smartify Section
     * http://www.vinay-sharma.com/jquery-plugins/jquery.smartify
     *
     * Copyright VINAY KUMAR SHARMA
     * Released under the MIT license
     * http://www.vinay-sharma.com/jquery-plugins/license/
     *
     * @author Vinay Kumar Sharma <vinaykrsharma@live.in>
     * @desc This plugin is a wrapper plugin for jQuery Smartify
     * to enhance usability and performance by binding on section/block
     * wise elements instead whole elements at once.
     * @version 1.0.0
     */
    $.fn.smartify_section = function (options, children_options) {
        var settings = {
            threshold: 0,
            on_trigger: "visible",
            persist_trigger: false,
            skip_invisible: true,
            children_selector: ".smartify-children"
        };
        $.extend(settings, options || {});
        this.each(function () {
            var $this = $(this);
            var this_settings = $.extend({}, settings, $this.data());
            var target = $this.attr("href");
            if (!target) {
                target = this_settings.target;
            }
            var elements;
            if (!target) {
                elements = $(this_settings.children_selector);
            } else {
                elements = $(target).find(this_settings.children_selector);
            }
            var callback_function = function (e) {
                elements.smartify(children_options);
                // Check if any manual event fired rather than smartify visible
                if (e.target) {
                    // Just scroll 2px to account smartify make children load and visible
                    // log($(e.target).scrollTop());
                    $window.scrollTop($window.scrollTop() + 2);
                    // setTimeout("$(window).scroll();", 100);
                }
            };
            if (this_settings.on_trigger === "visible") {
                // Smartify itself
                $this.smartify({threshold: this_settings.threshold, appear: callback_function});
            } else if (this_settings.on_trigger) {
                // Smartify Children on click
                if (this_settings.persist_trigger) {
                    $this.on(this_settings.on_trigger, callback_function);
                } else {
                    $this.one(this_settings.on_trigger, callback_function);
                }
            }
        });
    };

})(jQuery, window);
