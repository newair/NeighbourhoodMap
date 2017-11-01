module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist'],
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      src_and_lib: {
        files: {
          'dist/src.js': ['js/main.js', 'js/googleMapHandler.js', 'js/fourSquarHandler.js'],
          'dist/lib.js': ['lib/jquery-3.2.1.min.js', 'lib/knockout-3.4.2.js'],
        },
      }
    },

    jshint: {
      beforeconcat: ['Gruntfile.js','js/main.js', 'js/googleMapHandler.js', 'js/fourSquarHandler.js']
    },

    copy: {
      main: {
        files: [{
          expand: true,
          src: 'index.html',
          dest: 'dist/',
        },
        {
          expand: true,
          src: ['img/*'],
          dest: 'dist/',
        },
        {
          expand: true,
          src: 'css/main.css',
          dest: 'dist/',
          flatten: true,
          filter: 'isFile',
        },
       ]
      },
    },

    connect: {
      server: {
          options: {
              keepalive:true,
              port: 9001,
              base: 'dist',
              hostname: 'localhost'
          }

      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/src.js': ['dist/src.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean','concat', 'copy','connect:server']);
  grunt.registerTask('prod', ['clean','jshint','concat','uglify', 'copy','connect:server']);
  
};