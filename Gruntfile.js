var bower = require('bower');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-hustler');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['src/**/*'],
      tasks: ['build'],
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        // Does not work under Windows?
        //background: true,
        singleRun: false
      },
      once: {
        singleRun: true
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS', 'Firefox']
      }
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },

    clean: {
      dist: ['dist/'],
      tmp: ['.tmp/']
    },

    ngTemplateCache: {
      views: {
        files: {
          '.tmp/templates.js': 'src/**/*.tpl.html'
        },
        options: {
          trim: 'src/',
          module: 'ui.select'
        }
      }
    },

    concat: {
      dist: {
        src: [
          'src/select.js',
          '.tmp/templates.js'
        ],
        dest: 'dist/select.js'
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'src/select.css',
          dest: 'dist/select.css'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*!\n<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n<%= pkg.homepage %>\n*/\n',
        sourceMap: true
      },
      build: {
        files: {
          'dist/select.min.js': ['dist/select.js']
        }
      },
      compress: {
        global_defs: {
          "DEBUG": false
        },
        dead_code: true
      },
    },

    cssmin: {
      minify: {
        options: {
          banner: '/*!\n<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n<%= pkg.homepage %>\n*/\n',
        },
        files: {
          'dist/select.min.css': ['src/select.css']
        }
      }
    }

  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('build', ['clean', 'ngTemplateCache', 'concat', 'copy', 'uglify:build', 'cssmin', 'clean:tmp']);
  grunt.registerTask('test', ['build', 'karma:once']);
  grunt.registerTask('test:watch', ['build', 'karma:watch']);
  grunt.registerTask('test:travis', ['build', 'karma:travis']);
};
