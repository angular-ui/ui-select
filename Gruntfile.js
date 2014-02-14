var bower = require('bower');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-hustler');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  grunt.initConfig({
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
      dist: ['.tmp/', 'dist/']
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
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('build', ['clean', 'ngTemplateCache', 'concat', 'copy']);
  grunt.registerTask('test', ['build', 'karma:once']);
  grunt.registerTask('test:watch', ['build', 'karma:watch']);
  grunt.registerTask('test:travis', ['build', 'karma:travis']);
};
