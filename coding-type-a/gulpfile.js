
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const mmq          = require('gulp-merge-media-queries');
const cleanCss     = require('gulp-clean-css');
const browserSync  = require('browser-sync');

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
	gulp.watch('src/scss/**/*.scss', gulp.task('sass'));
	gulp.watch([
		'html/**/*.html',
		'html/**/*.php',
		'html/**/*.js',
	]).on('change', browserSync.reload)
});

/**
 * browser sync
 */
gulp.task('server', ()=>{
	browserSync.init({
		server: {baseDir: 'html'}, // static
		startPath: '/',
		// proxy: 'localhost:8000', // connect php
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
 * default
 */
gulp.task('default',
	gulp.series(
		gulp.parallel(
			'sass',
			'server',
			'watch',
		)
	)
);
