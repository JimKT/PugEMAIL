"use strict";

// Require this for use in GULP
var pug = require('gulp-pug');
var gulp = require('gulp');
var replace = require ('gulp-replace');

// PUG Compile + Pretty
gulp.task('views', function buildHTML() {
  return gulp.src('layout.pug')
  .pipe(pug({
        pretty: true
    }))
  .pipe(gulp.dest(''));
});

gulp.task('dev', function(){
  gulp.src(['layout.html'])
    .pipe(replace('src="', 'src="http://media.laredoute.com/repository/sites/3/en-GB/images/'))
    .pipe(gulp.dest(''));
});

gulp.task('production', function(){
  gulp.src(['layout.html'])
    .pipe(replace('src="', 'src="//media.laredoute.com/repository/sites/3/en-GB/images/'))
    .pipe(gulp.dest(''));
});

// Default Watch
gulp.task('default', ['views',], function() {
  // PUG Watch
 gulp.watch(['*.pug'], ['views']);
});
