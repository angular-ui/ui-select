var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var es = require('event-stream');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var conventionalRecommendedBump = require('conventional-recommended-bump');

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * <%= pkg.name %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};

gulp.task('default', ['build','test']);
gulp.task('build', ['scripts', 'styles']);
gulp.task('test', ['build', 'karma']);

gulp.task('watch', ['build','karma-watch'], function() {
  gulp.watch(['src/**/*.{js,html}'], ['build']);
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('scripts', ['clean'], function() {

  var buildTemplates = function () {
    return gulp.src('src/**/*.html')
      .pipe($.minifyHtml({
             empty: true,
             spare: true,
             quotes: true
            }))
      .pipe($.angularTemplatecache({module: 'ui.select'}));
  };

  var buildLib = function(){
    return gulp.src(['src/common.js','src/*.js'])
      .pipe($.plumber({
        errorHandler: handleError
      }))
      .pipe($.concat('select_without_templates.js'))
      .pipe($.header('(function () { \n"use strict";\n'))
      .pipe($.footer('\n}());'))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jshint.reporter('fail'));
  };

  return es.merge(buildLib(), buildTemplates())
    .pipe($.plumber({
      errorHandler: handleError
    }))
    .pipe($.concat('select.js'))
    .pipe($.header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe($.rename({ext:'.min.js'}))
    .pipe(gulp.dest('dist'));

});

gulp.task('styles', ['clean'], function() {

  return gulp.src('src/common.css')
    .pipe($.header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe($.rename('select.css'))
    .pipe(gulp.dest('dist'))
    .pipe($.minifyCss())
    .pipe($.rename({ext:'.min.css'}))
    .pipe(gulp.dest('dist'));

});

gulp.task('karma', ['build'], function() {
  karma.start({configFile : __dirname +'/karma.conf.js', singleRun: true});
});

gulp.task('karma-watch', ['build'], function() {
  karma.start({configFile :  __dirname +'/karma.conf.js', singleRun: false});
});

gulp.task('pull', function(done) {
  $.git.pull();
  done();
});

gulp.task('add', function() {
  return gulp.src(['./*', '!./node_modules', '!./bower_components'])
    .pipe($.git.add());
});

gulp.task('recommendedBump', function(done) {
  /**
   * Bumping version number and tagging the repository with it.
   * Please read http://semver.org/
   *
   * To bump the version numbers accordingly after you did a patch,
   * introduced a feature or made a backwards-incompatible release.
   */

  conventionalRecommendedBump({preset: 'angular'}, function(err, importance) {
    // Get all the files to bump version in
    gulp.src(['./package.json', './bower.json'])
      .pipe($.bump({type: importance}))
      .pipe(gulp.dest('./'));

    done();
  });
});

gulp.task('changelog', function() {

  return gulp.src('CHANGELOG.md', {buffer: false})
    .pipe($.conventionalChangelog({preset: 'angular'}))
    .pipe(gulp.dest('./'));
});

gulp.task('push', function(done) {
  $.git.push('origin', 'master', {args: '--tags'});
  done();
});

gulp.task('commit', function() {
  return gulp.src('./')
    .pipe($.git.commit('chore(release): bump package version and update changelog', {emitData: true}))
    .on('data', function(data) {
      console.log(data);
    });
});

gulp.task('tag', function() {
  return gulp.src('package.json')
    .pipe($.tagVersion());
});

gulp.task('bump', function(done) {
  runSequence('recommendedBump', 'changelog', 'add', 'commit', 'tag', 'push', done);
});

var handleError = function (err) {
  console.log(err.toString());
  this.emit('end');
};