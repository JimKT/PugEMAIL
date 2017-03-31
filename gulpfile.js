"use strict";
const pug = require('gulp-pug');
const gulp = require('gulp');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const inlineCss = require('gulp-inline-css');

const URL = 'http://localhost/pug-email/dist/layout.html';
const pugDKR = 'src/pug/layout.pug'

gulp.task('views', function buildHTML() {
    return gulp.src(pugDKR)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('inline', function() {
    return gulp.src('dist/layout.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function(){
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('src/images/'))
});

gulp.task('browser-sync', function() {
    var files = [
        '**/*.html',
        '*.html',
    ];
    browserSync.init(files, {
        proxy: URL,
    });
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch([pugDKR], ['views', 'inline'])
    gulp.watch(['./src/scss/*.scss'], ['sass', 'inline']);
    gulp.watch(['**/*.jpg'], ['imagemin']);
});
