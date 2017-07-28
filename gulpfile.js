"use strict";
const gulp = require('gulp');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const inlinesource = require('gulp-inline-source');
const inlineCss = require('gulp-inline-css');
const prettify = require('gulp-jsbeautifier');
const litmus = require('gulp-litmus');
const campaigns = require('./src/config');
const credentials = require('./src/credentials');
const week = campaigns.Week;
const campaign = campaigns.Campaign;
const tracking = campaigns.Tracking;
const mid = campaigns.Mid;
const nc = campaigns.Nc;
const litmusUser = credentials.LitmusUsername;
const litmusPass = credentials.LitmusPassword;
const litmusUrl = credentials.LitmusURL;
const imgSrc = './src/' + week + campaign + '/img/';
const styleSrc = './src/css/**/*.scss';
const distHTML = './dist/' + week + '/' + campaign + '/';
const campaignName = './src/views/' + week + '/' + campaign;
const pugIndex = './src/views/' + week + '/' + campaign + '/index.pug';
// Test to Litmus
const config = {
	subject: campaign,
    username: litmusUser,
    password: litmusPass,
    url: litmusUrl,
    applications: [
		// Gmail
        'gmailnew',
        'ffgmailnew',
		'chromegmailnew',
		// Yahoo
		'yahoo',
		'ffyahoo',
		'chromeyahoo',
		// Outlook
		'outlookcom',
		'ffoutlookcom',
		'chromeoutlookcom',
		// Outlook ( Desktop )
		'ol2007',
		'ol2010',
		'ol2013',
		// Android
		'android4',
		'androidgmailapp',
		'iphone5s',
		'iphone6',
		'iphone6plus',
		'iphone6s',
    ]
}
gulp.task('litmus', () =>
	gulp.src(distHTML + 'index.html')
		.pipe(litmus(config))
		.pipe(gulp.dest('dist'))
);
// Convert PUG into HTML
gulp.task('pug', () =>
	 gulp.src(pugIndex)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./dist/' + week + '/' + campaign))
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
		.pipe(gulp.dest('./dist/css'))
);
// Compile Sass
gulp.task('replace-links', () => 
	gulp.src(distHTML + 'index.html')
		.pipe(replace('aspx', 'aspx?omniturecode=Email_Commercial_' + tracking + '&ecm_mid=' + mid + '&nc=' + nc + '&utm_source=PromotionalEmail&utm_medium=Email&utm_campaign=' + tracking))
		.pipe(replace('images', 'https://s3-eu-west-1.amazonaws.com/hub-mdp/emails/la-redoute_emails/' + campaign))
		.pipe(gulp.dest('./dist/' + week + '/' + campaign + '/'))
	);
// Inline CSS
gulp.task('inline-css', () => 
	gulp.src('dist/' + week + '/' + campaign + '/index.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('./dist/' + week + '/' + campaign + '/'))
);
// Minify Images
gulp.task('images', () =>
	gulp.src('src/W01/J286/img/*')
	.pipe(imagemin({
		optimizationLevel: 5
	}))
	.pipe(gulp.dest('dist/' + week + '/' + campaign + '/img/'))
);
// Beautify HTML
gulp.task('beautify', () => 
	gulp.src(distHTML + 'index.html')
		.pipe(prettify())
		.pipe(gulp.dest(distHTML))
);
// Default ( Runs all Tasks on Watch )
gulp.task('watch-src', () => 
	runSequence('pug', 'sass', 'inline-css', 'replace-links', 'beautify', 'latest')
);
gulp.task('watch-js', () =>
	runSequence('clean-dist','pug','live', 'mobile', 'prettify')
);
gulp.task('watch-images', () =>
	runSequence('clean-dist','pug','live', 'mobile', 'prettify')
);
gulp.task('default', function() {
	console.log('Welcome to PUG Email Creator. The current campaign is ' + week + '/' + campaign),
	gulp.watch([styleSrc], ['watch-src']),
	gulp.watch([pugIndex], ['watch-src']),
	gulp.watch([campaignName + '/src/js/**/*'], ['watch-js']),
	gulp.watch([campaignName + '/src/img/**/*'], ['watch-images'])
});