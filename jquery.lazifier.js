/**
 * Copyright 2016, VINAY KUMAR SHARMA Pvt. Ltd.
 * Licensed under the MIT license.
 * http://www.vinay-sharma.com/jquery-plugins/license/
 *
 * @author Vinay Kumar Sharma
 * @desc A small plugin that checks whether elements are within
 *       the user visible viewport of a web browser, and applies
 *       the defined action.
 *       only accounts for vertical position, not horizontal.
 * @version 1.0.0-alpha
 */
;
(function ($, window, document, undefined) {
    var $window = $(window);
    var $container = $window;
    var container_width = 0,
        container_height = 0;

    var log = console && console.log ? function (d) {
        console.log(d);
    } : $.noop;

    $.fn.lazify = function (options) {
        var elements = this;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            src_attr: "ng-src",
            skip_invisible: true,
            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            // Callback functions
            appear: $.noop,
            load: $.noop
        };

        $.extend(settings, options || {});

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined || settings.container === window) ?
            $window : $(settings.container);

        // call this function on window.resize() and on window.load()
        // do not required to call every time
        function update_container() {
            if ($.container_is_window()) {
                container_height = window.innerHeight ? window.innerHeight : $container.height();
            }
            container_height = $container.height();
            container_width = $container.width();
        }

        function update() {
            var counter = 0;

            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.above_the_top(this, settings) ||
                    $.left_of_begin(this, settings)) {
                    /* Nothing. */
                } else if (!$.below_the_fold(this, settings) && !$.right_of_fold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        function remove_loaded_elements() {
            /* Remove image from array so it is not looped next time. */
            var temp = $.grep(elements, function (element) {
                return !(element.loaded || element.no_src_attr);
            });
            elements = $(temp);
        }

        function load_for_image(element, element_settings, remove_this_element) {
            var $element = $(element);
            var src_original = $.trim($element.attr(element_settings.src_attr));
            $("<img />").bind("load", function () {
                $element.hide();
                if ($element.is("img")) {
                    $element.attr("src", src_original);
                } else {
                    $element.css("background-image", "url('" + src_original + "')");
                }
                $element[element_settings.effect](element_settings.effect_speed);

                element.loaded = true;
                remove_this_element();
                element_settings.load(self, elements, element_settings, undefined, undefined);
            }).attr("src", src_original);
        }

        function load_for_iframe(element, element_settings, remove_this_element) {
            var $element = $(element);
            var src_original = $.trim($element.attr(element_settings.src_attr));
            $("<iframe>").bind("load", function () {
                $element.attr('src', src_original);
                $element[element_settings.effect](element_settings.effect_speed);
                element.loaded = true;
                remove_this_element();
                element_settings.load(self, elements, element_settings, undefined, undefined);
            }).attr("src", src_original);
        }

        function load_for_anchor(element, element_settings, remove_this_element) {
            var $element = $(element);
            var url = $element.attr('href');
            var to_do = $element.data('do');
            var $target = $element.data('target');
            //
            // Using selector, e.g #target_element
            $target = $($target);
            // or has defined to propagate in parent
            if ($target === 'in-parent') {
                $target = $element.parent();
            }

            if ($target.is('iframe')) {
                // just call `load_for_iframe` here
                load_for_iframe(element, element_settings, remove_this_element);
            } else {
                $.ajax(url, function (responseText) {
                    responseText = $.parseHTML(responseText);
                    if (to_do === 'append') {
                        $target.appendChild(responseText);
                    } else {
                        $target.html(responseText);
                    }

                    $target[element_settings.effect](element_settings.effect_speed);

                    element.loaded = true;
                    remove_this_element();
                    element_settings.load(self, elements, element_settings, responseText, undefined);
                }).fail(function (jqXHR, textStatus) {
                    element_settings.load(self, elements, element_settings, jqXHR, textStatus);
                });
            }
        }

        /* Fire one scroll event per scroll. Not one scroll event per element. */
        if (settings.event.indexOf("scroll") === 0) {
            $container.bind(settings.event, function () {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);
            //
            // Set default flags
            self.loaded = false;
            self.no_src_attr = false;
            //
            // clone to change for this element if some configurations
            // found in data attributes
            // and keep original unchanged to others
            var element_settings = $.extend({}, settings);
            var src = $.trim($self.attr('src')) || false;
            var src_original = $.trim($self.attr(element_settings.src_attr)) || false;
            var threshold = parseInt($.trim($self.data('threshold')) || 0);
            //
            // Types
            var is_a = $self.is('a');
            var is_img = $self.is('img');
            var if_iframe = $self.is('iframe');
            //
            // Class
            var toggle_class = $element.data('toggle-class');
            var add_class = $element.data('add-class');
            var remove_class = $element.data('remove-class');

            if(toggle_class || add_class || remove_class) {
                // add to callback event,
                // So, whenever it will be called
                //
                // Here accept all arguments, which ever has maximum
                // and pass same as well
                element_settings.load = function(element, elements, element_settings, jqXHR, textStatus) {
                    element_settings.load(element, elements, element_settings, jqXHR, textStatus);
                    if(toggle_class) {
                        element.toggleClass(toggle_class);
                    }
                    if(remove_class) {
                        element.toggleClass(remove_class);
                    }
                    if(add_class) {
                        element.toggleClass(add_class);
                    }
                };
            }

            // If img/iframe element has no/empty src attribute use placeholder.
            if ((is_img || is_iframe) && !src) {
                $self.attr("src", element_settings.placeholder);
            }

            // If element is in the collection, but don't have value of `src_attr` attribute
            if ((is_img || is_iframe) && !src_original) {
                log('%cElement has no ' + element_settings.src_attr + ' defined to load', 'color: #ff9900;');
                // Remove element from array so it is not looped next time.
                self.no_src_attr = true;
                remove_loaded_elements();
                return
            }

            if (threshold) {
                element_settings.threshold = $self.data('threshold');
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                // Return from here, if image is already loaded
                if (this.loaded) {
                    return
                }

                // If after appear callback has defined
                // call the callback function with some parameters
                if (element_settings.appear) {
                    // pass the rest elements, so user can cook something on that
                    element_settings.appear.call(self, elements, element_settings);
                }

                if (is_img) {
                    load_for_image(self, element_settings, remove_loaded_elements);
                } else if (is_a) {
                    if ($self.data('target')) {
                        load_for_anchor(self, remove_loaded_elements);
                    } else {
                        log('%cAn Anchor Tag must have defined data-target="" property to load response content in!', 'color: #ff9900;');
                    }
                } else if (is_iframe) {
                    load_for_iframe(self, element_settings, remove_loaded_elements);
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
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

        var init = function () {
            update_container();
            update();
        };

        /* Check if something appears when window is resized. */
        $window.bind("resize", init);
        /* Force initial check if images should appear. */
        $(document).ready(init);

        return this;
    };


    $.container_is_window = function () {
        return $container === $window;
    };

    function container_top() {
        if ($.container_is_window()) {
            return $container.scrollTop();
        }
        return $container.offset().top;
    }

    function container_left() {
        if ($.container_is_window()) {
            return $container.scrollLeft();
        }
        return $container.offset().left;
    }

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.below_the_fold(element, {threshold : 100, container : window}) */

    $.below_the_fold = function (element, settings) {
        return container_height + container_top() <= $(element).offset().top - settings.threshold;
    };

    $.right_of_fold = function (element, settings) {
        return container_width + container_left() <= $(element).offset().left - settings.threshold;
    };

    $.above_the_top = function (element, settings) {
        return container_top() >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.left_of_begin = function (element, settings) {
        return container_left() >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.in_view_port = function (element, settings) {
        return !$.right_of_fold(element, settings) && !$.left_of_begin(element, settings) && !$.below_the_fold(element, settings) && !$.above_the_top(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:visible-in-viewport").something() or */
    /* $("img").filter(":visible-in-viewport").something() which is faster */
    $.extend($.expr[":"], {
        "visible-in-viewport": function (a) {
            return $.in_view_port(a, {threshold: 0});
        },
        "below-the-fold": function (a) {
            return $.below_the_fold(a, {threshold: 0});
        },
        "above-the-top": function (a) {
            return !$.below_the_fold(a, {threshold: 0});
        },
        "right-of-screen": function (a) {
            return $.right_of_fold(a, {threshold: 0});
        },
        "left-of-screen": function (a) {
            return !$.right_of_fold(a, {threshold: 0});
        }
    });

})(jQuery, window, document);
