/**
 * Copyright 2016, VINAY KUMAR SHARMA
 * Licensed under the MIT license.
 * http://www.vinay-sharma.com/jquery-plugins/license/
 *
 * @author Vinay Kumar Sharma
 * @desc A small plugin that checks whether elements are within
 *       the user visible viewport of a web browser, and applies
 *       the defined action.
 *       only accounts for vertical position, not horizontal.
 * @version 1.0.0-beta
 */
;
(function ($, window, document, undefined) {
    var $window = $(window);
    var $container = $window;
    var container_width = 0,
        container_height = 0;

    // Lazify
    // Lazifire
    // Lazifier
    // Lazified
    $.fn.lazify = function (options) {
        var elements = this;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            src_attr: "ng-src",
            // src_attr: "original",
            skip_invisible: true,
            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            // Callback function
            appear: null,
            load: null
        };

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
        settings.container === window) ? $window : $(settings.container);

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

        function load_for_image(element, src_original, call_back) {
            $("<img />").bind("load", function () {
                var $element = $(element);
                $element.hide();
                if ($element.is("img")) {
                    $element.attr("src", src_original);
                } else {
                    $element.css("background-image", "url('" + src_original + "')");
                }
                $element[settings.effect](settings.effect_speed);

                element.loaded = true;

                call_back();

                // If after load callback has defined
                // call the callback function with some parameters
                if (settings.load) {
                    // pass the rest elements, so user can cook something on them
                    settings.load.call(self, elements, settings);
                }
            }).attr("src", src_original);
        }

        function load_for_anchor(element, call_back) {
            var $element = $(element);
            var url = $element.attr('href');
            var do_what = $element.data('do');
            var $target = $element.data('target');
            // Either define to propagate in parent
            if ($target === 'in-parent') {
                $target = $element.parent();
            } else {
                // or using selector, e.g #target_element
                $target = $($target);
            }

            if ($target.is('iframe')) {
                $target.attr('src', url);

                $target[settings.effect](settings.effect_speed);

                element.loaded = true;

                call_back();

                // If after load callback has defined
                // call the callback function with some parameters
                if (settings.load) {
                    // pass the rest elements, so user can cook something on them
                    settings.load.call(self, elements, settings);
                }
            } else {
                $.ajax(url, function (responseText) {
                    responseText = $.parseHTML(responseText);
                    if (do_what === 'append') {
                        $target.appendChild(responseText);
                    } else {
                        $target.html(responseText);
                    }

                    $target[settings.effect](settings.effect_speed);

                    element.loaded = true;

                    call_back();

                    // If after load callback has defined
                    // call the callback function with some parameters
                    if (settings.load) {
                        // pass the rest elements, so user can cook something on them
                        settings.load.call(self, elements, settings);
                    }
                });
            }
        }

        if (options) {
            $.extend(settings, options);
        }

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function () {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);
            // clone to change for this element if some configurations
            // found in data attributes
            // and keep original unchanged to others
            var self_settings = $.extend({}, settings);
            var src = $.trim($self.attr('src')) || false;
            var src_original = $.trim($self.attr(settings.src_attr)) || false;
            var threshold = parseInt($.trim($self.data('threshold')) || 0);
            var is_img = $self.is('img');

            self.loaded = false;
            self.no_src_attr = false;

            // If element is in the collection, but don't have value of `src_attr` attribute
            if (is_img && !src_original) {
                /* Remove element from array so it is not looped next time. */
                self.no_src_attr = true;
                remove_loaded_elements();
                return
            }

            if (threshold) {
                self_settings.threshold = $self.data('threshold');
            }

            /* If element is an img and no src attribute given use data:uri. */
            if (is_img && !src) {
                $self.attr("src", settings.placeholder);
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                // Return from here, if image is already loaded
                if (this.loaded) {
                    return
                }

                // If after appear callback has defined
                // call the callback function with some parameters
                if (settings.appear) {
                    // pass the rest elements, so user can cook something on them
                    settings.appear.call(self, elements, settings);
                }

                console.log('Elements left: ' + elements.length);
                if (is_img) {
                    console.log('Element is an Image Tag!');
                    load_for_image(self, src_original, remove_loaded_elements);
                } else if ($self.is('a')) {
                    console.log('Element is an Anchor Tag!');
                    load_for_anchor(self, remove_loaded_elements);
                } else if ($self.is('iframe')) {
                    $self.attr('src', src_original);
                    console.log('Element is an iFrame Tag!');
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function () {
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
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */
    $.extend($.expr[":"], {
        "in-viewport": function (a) {
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

