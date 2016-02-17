/*!
 * Smartify's Gruntfile
 * http://www.vinay-sharma.com/jquery-plugins/smartify
 * Copyright 2016 VINAY KUMAR SHARMA <vinaykrsharma@live.in>
 * Licensed under MIT (https://github.com/vinaykrsharma/jquery.smartify/blob/master/LICENSE)
 */

module.exports = function(grunt) {
    "use strict";

    // Use Unix newlines
    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        banner: "/*!\n" +
                " * jQuery Smartify v<%= pkg.version %>\n" +
                " * <%= pkg.homepage %>\n" +
                " * Licensed under the <%= pkg.licence %>\n" +
                " * Copyright <%= grunt.template.today(\"yyyy\") %> <%= pkg.author %>" +
                " */\n",
        connect: {
            server: {
                options: {
                    base: ".",
                    port: 9999
                }
            }
        },
        uglify : {
            options: {
                compress: {
                  warnings: false
                },
                mangle: true,
                preserveComments: /^!|@preserve|@license|@cc_on/i
            },
            build: {
                src: "src/<%= pkg.name %>.js",
                dest: "build/<%= pkg.name %>.min.js"
            },
            target: {
                files: {
                    "<%= pkg.name %>.min.js" : "<%= pkg.name %>.js"
                }
            }
        },
        watch: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            tasks: ["test"],
        },
        jshint: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jasmine: {
            src: ["test/specs/jasmine.js"],
            options: {
                helpers: "test/specs/helpers/*Helper.js",
                specs: "test/specs/*Spec.js",
                vendor: ["test/vendor/jquery-2.1.4.js", "test/vendor/jasmine-jquery.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-jasmine-runner");
    grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("default", ["test", "uglify", "jasmine"]);
};

