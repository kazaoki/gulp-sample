
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const mmq          = require('gulp-merge-media-queries');
const cleanCss     = require('gulp-clean-css');
const browserSync  = require('browser-sync');
const connectPhp   = require('gulp-connect-php');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const mozjpeg      = require('imagemin-mozjpeg');

/**
 * sass
 */
gulp.task('sass', ()=>{
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(mmq())
		.pipe(cleanCss({format: 'beautify'}))
		.pipe(gulp.dest('html/css'))
});

/**
 * watch files change
 */
gulp.task('watch', ()=>{
	gulp.watch('src/scss/**/*.scss', gulp.task('sass'))
	gulp.watch('src/images/**/*.{jpg,jpeg,png,gif,svg}', gulp.task('imagemin'))
	gulp.watch([
		'html/**/*.html',
		'html/**/*.php',
		'html/**/*.js',
	]).on('change', browserSync.reload)
});

/**
 * connect php
 */
gulp.task('connect-php', ()=>{
	connectPhp.server({
		base: './html',
		stdio: 'ignore'
	});
});

/**
 * browser sync
 */
gulp.task('server', ()=>{
	browserSync.init({
		// server: {baseDir: 'html'}, // static
		startPath: '/',
		proxy: 'localhost:8000', // connect php
		// proxy: 'localhost:80', // genie
		// proxy: {
		// 	target: 'localhost',
		// 	proxyReq: [
		// 		function(proxyReq) {
		// 			proxyReq.setHeader('X-BrowserSync-Proxy-Port', '3000');
		// 		}
		// 	]
		// }
	});
});

/**
 * imagemin
 */
gulp.task('imagemin', function () {
	gulp.src('src/images/**/*.{jpg,jpeg,png,gif,svg}')
	.pipe(imagemin([
		pngquant({ quality: [0.65, 0.80], speed: 1 }),
		mozjpeg({ quality: 80 }),
		imagemin.svgo(),
		imagemin.gifsicle()
	]))
	.pipe(gulp.dest('html/images'));
});

/**
 * default
 */
gulp.task('default',
	gulp.series(
		gulp.parallel(
			'connect-php',
			'sass',
			'imagemin',
			'server',
			'watch',
		)
	)
);
