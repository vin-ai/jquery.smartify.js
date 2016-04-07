module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON("jquery.smartify.jquery.json"),
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
      "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
      "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" +
      "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" +
      " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n",
    // Task configuration.
    clean: {
      files: ["dist", "build"]
    },
    concat: {
      options: {
        banner: "<%= banner %>",
        stripBanners: true
      },
      dist: {
        src: ["src/<%= pkg.name %>.js"],
        dest: "dist/<%= pkg.name %>.js"
      },
    },
    uglify: {
      options: {
        banner: "<%= banner %>"
      },
      dist: {
        src: "<%= concat.dist.dest %>",
        dest: "dist/<%= pkg.name %>.min.js"
      },
    },
    qunit: {
      files: ["test/**/*.html"]
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jshintrc: true,
          jQuery: true,
          module: true
        }
      },
      gruntfile: {
        src: "Gruntfile.js"
      },
      src: {
        src: ["src/**/*.js"]
      },
      test: {
        src: ["test/**/*.js"]
      },
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    connect: {
      server: {
        options:{
          port: 8080,
          hostname: "localhost",
          keepalive : true,
          // base: "demo",
          debug: true,
          livereload: true
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");

  // Default task.
  grunt.registerTask("test", ["jshint", "qunit"]);
  grunt.registerTask("default", ["clean", "jshint", "qunit", "concat", "uglify"]);
  grunt.registerTask("server", ["connect"]);

};
