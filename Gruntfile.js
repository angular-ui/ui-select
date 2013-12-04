var bower = require('bower');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  grunt.registerTask('bower', 'Install Bower packages.', function () {
    var done = this.async();

    bower.commands.install()
      .on('log', function (result) {
        grunt.log.ok('bower: ' + result.id + ' ' + result.data.endpoint.name);
      })
      .on('error', grunt.fail.warn.bind(grunt.fail))
      .on('end', done);
  });

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      watch: {
        background: true
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
    }
  });

  grunt.registerTask('default', ['bower', 'test']);
  grunt.registerTask('test', ['bower', 'karma:once']);
  grunt.registerTask('test:watch', ['bower', 'karma:watch']);
  grunt.registerTask('test:travis', ['bower', 'karma:travis']);
};
