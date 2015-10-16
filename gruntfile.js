'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    // TEST SETUP
    mochaTest: {
      all: {
        src: [
          '**/*.spec.js',
          '*.spec.js'
        ],
        options: {
          reporter: 'spec',
          quiet: false,
          bail: true
        }
      }
    },
    // CODE STYLE ENFORCEMENT
    jscs: {
      all: [
        './*.js',
        'src/**/*.js'
      ],
      options: {
        config: '.jscsrc',
        esnext: true,
        verbose: true
      }
    },
    // CODE CORRECTNESS CHECKING
    jshint: {
      files: ['' +
      './*.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [
    'jshint',
    'jscs:all',
    'mochaTest:all'
  ]);
};
