var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var es = require('event-stream');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');//To prevent pipe breaking caused by errors at 'watch'

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
      .pipe(minifyHtml({
             empty: true,
             spare: true,
             quotes: true
            }))
      .pipe(templateCache({module: 'ui.select'}));
  };

  var buildLib = function(){
    return gulp.src('src/select.js')
      .pipe(plumber({
        errorHandler: handleError
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  };

  return es.merge(buildLib(), buildTemplates())
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(concat('select.js'))
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename({ext:'.min.js'}))
    .pipe(gulp.dest('dist'));

});

gulp.task('styles', ['clean'], function() {

  return gulp.src('src/select.css')
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(minifyCSS())
    .pipe(rename({ext:'.min.css'}))
    .pipe(gulp.dest('dist'));

});

gulp.task('karma', ['build'], function() {
  karma.start({configFile : __dirname +'/karma.conf.js', singleRun: true});
});

gulp.task('karma-watch', ['build'], function() {
  karma.start({configFile :  __dirname +'/karma.conf.js', singleRun: false});
});

var handleError = function (err) {
  console.log(err.toString());
  this.emit('end');
};
