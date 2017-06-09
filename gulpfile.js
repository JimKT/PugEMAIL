"use strict";
// Require the Following to Work
const gulp = require('gulp');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const inlinesource = require('gulp-inline-source');
const inlineCss = require('gulp-inline-css');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// Campaign Specific Variables
const week = 'WK12';
const job = 'J12';
const directory = 'emails/' + week + '/' + job + '/';

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
		proxy: 'localhost/pugemail/layout.html'
    });
});
gulp.task('clean', function(){
    return gulp.src('dist/**/*.html')
    .pipe(clean());
});

gulp.task('inlinesource', function () {
    return gulp.src('dist/' + directory + 'compiled.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('dist/' + directory));
});

// PUG Compile
gulp.task('views', function buildHTML() {
    return gulp.src('src/' + directory + 'layout.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./dist/' + directory));
});


gulp.task('sync-file', function buildHTML() {
    return gulp.src('src/' + directory + 'layout.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./'));
});

// SASS
gulp.task('sass', function () {
  return gulp.src('src/css/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('replace', function() {
    return gulp.src(['dist/' + directory + 'layout.html'])
    .pipe(replace('./css/style.css', '../../../css/style.css'))
	.pipe(rename("compiled.html"))
	.pipe(gulp.dest('dist/' + directory));
});

gulp.task('inline', function() {
    return gulp.src('dist/' + directory + 'compiled.html')
	.pipe(inlineCss({
            	applyStyleTags: true,
            	applyLinkTags: true,
            	removeStyleTags: true,
            	removeLinkTags: true
        }))

    .pipe(gulp.dest('dist/' + directory));
});

// Image Minification
gulp.task('images', function(){
    gulp.src('src/' + directory + 'img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/' + directory + 'img/'))
});
// Default ( Runs all Tasks on Watch )
gulp.task('build', function() {
    runSequence('clean', 'sass', 'views', 'replace', 'inlinesource', 'inline',  'images');
});
// Default ( Runs all Tasks on Watch )
gulp.task('default', function() {
    gulp.watch(['./src/**/*'], ['build']);
});
