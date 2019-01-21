"use strict";
// Required
const gulp = require('gulp');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const prettify = require('gulp-jsbeautifier');
const autoprefixer = require('gulp-autoprefixer');
const inlinesource = require('gulp-inline-source');
const inlineCss = require('gulp-inline-css');
// Directories 
const campaignName = 'met-quarter';
const imgSrc = './src/' + campaignName + '/images/';
const styleSrc = './src/css/main.scss';
const pugIndex = './src/' + campaignName + '/index.pug';
const distHTML = './dist/' + campaignName + '/';
const secret = require('./secret.json');


 
const config = {
    username: secret.user,
    password: secret.password,
    url: secret.url,
    applications: [
        'applemail6',
        'gmailnew',
        'ffgmailnew',
        'chromegmailnew',
        'iphone4s',
    ]
}

// Convert PUG into HTML
gulp.task('pug', () =>
	 gulp.src(pugIndex)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./dist/' + campaignName))
);
gulp.task('latest', () =>
	 gulp.src(distHTML + 'index.html')
		.pipe(rename("latest.html"))
		.pipe(gulp.dest('./dist/'))
);
// Compile Sass
gulp.task('sass', () => 
	gulp.src(styleSrc)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css/'))
);
// Inline CSS
gulp.task('inline-css', () => 
	gulp.src('./dist/' + campaignName + '/index.html')
		.pipe(inlinesource())
        .pipe(gulp.dest('./dist/' + campaignName + '/'))
);
// Minify Images
gulp.task('images', () =>
	gulp.src(imgSrc + '*')
	.pipe(imagemin({
		optimizationLevel: 5
	}))
	.pipe(gulp.dest('dist/' + campaignName + '/images/'))
);
// Beautify HTML
gulp.task('beautify', () => 
	gulp.src(distHTML + 'index.html')
		.pipe(prettify())
		.pipe(gulp.dest(distHTML)) 
);
// Default ( Runs all Tasks on Watch )
gulp.task('watch-src', () => 
	runSequence('pug', 'sass', 'inline-css', 'latest', 'beautify', 'images')
);
gulp.task('watch-js', () =>
	runSequence('clean-dist','pug','live', 'mobile', 'prettify', 'images')
);
gulp.task('watch-images', () =>
	runSequence('clean-dist','pug','live', 'mobile', 'prettify', 'images')
);
gulp.task('default', function() {
	console.log('Welcome to PUG Email Creator. The current campaign is ' + campaignName),
	gulp.watch([styleSrc], ['watch-src']),
	gulp.watch([pugIndex], ['watch-src']),
	gulp.watch(['./src/views/**/*.pug'], ['watch-src']),
	gulp.watch([campaignName + '/src/js/**/*'], ['watch-js']),
	gulp.watch([campaignName + '/src/img/**/*'], ['watch-images'])
});