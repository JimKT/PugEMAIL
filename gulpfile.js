"use strict";
// Required
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const beautify = require('gulp-jsbeautifier');
const inlinesource = require('gulp-inline-source');
// Directories 
const campaignName = 'met-quarter';
const imgSrc = './src/' + campaignName + '/images/';
const styleSrc = './src/css/main.scss';
const pugIndex = './src/' + campaignName + '/index.pug';
const distHTML = './dist/' + campaignName + '/';

// Convert PUG into HTML
gulp.task('pug', () =>
	 gulp.src(pugIndex)
		.pipe(pug({
			pretty: true
		}))
		.pipe(beautify())
		.pipe(gulp.dest('./dist/' + campaignName))
);
gulp.task('latest', () =>
	 gulp.src(distHTML + 'index.html')
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
// Default ( Runs all Tasks on Watch )
gulp.task('watch-src', () => 
	runSequence('pug', 'sass', 'inline-css', 'latest', 'images')
);
gulp.task('watch-js', () =>
	runSequence('pug', 'images')
);
gulp.task('watch-images', () =>
	runSequence('pug', 'images')
);
gulp.task('default', function() {
	console.log('Welcome to PUG Email Creator. The current campaign is ' + campaignName),
	gulp.watch([styleSrc], gulp.series('pug', 'sass', 'inline-css', 'latest', 'images')),
	gulp.watch([pugIndex], gulp.series('pug', 'sass', 'inline-css', 'latest', 'images')),
	gulp.watch(['./src/views/**/*.pug'], gulp.series('pug', 'sass', 'inline-css', 'latest', 'images')),
	gulp.watch([campaignName + '/src/js/**/*'], gulp.series('pug', 'images')),
	gulp.watch([campaignName + '/src/img/**/*'], gulp.series('pug', 'images'))
});