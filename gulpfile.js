const gulp = require('gulp'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cssnano = require('gulp-cssnano'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync'),
	htmlmin = require('gulp-htmlmin');

// // ПРЕОБРАЗОВАНИЕ SASS ФАЙЛОВ В CSS
gulp.task('sass', function () {
	return gulp.src('app/scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			errorLogToConsole: true,
			outputStyle: 'compressed'
		}))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.stream());
})

// ОБЪЕДИНЕНИЕ БИБЛИОТЕК JS В ОДИН ФАЙЛ
gulp.task('scripts', function () {
	return gulp.src('app/libs/**/*.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.stream());
})

// ОБЪЕДИНЕНИЕ СТИЛЕЙ В ОДИН ФАЙЛ
gulp.task('styles', function () {
	return gulp.src('app/libs/**/*.css')
		.pipe(concat('libs.min.css'))
		.pipe(cssnano())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
})

// BROWSER SYNC
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});
});

gulp.task('watch', function() {
	gulp.watch("app/scss/**/*", gulp.parallel('sass'));
	gulp.watch("app/**/*.html").on("change", browserSync.reload);
	gulp.watch("app/**/*.js").on("change", browserSync.reload);
	gulp.watch("app/fonts/**/*").on("all", browserSync.reload);
	gulp.watch("app/img/**/*").on("all", browserSync.reload);
})

// ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
gulp.task('img', function() {
	return gulp.src('app/img/**.*')
		.pipe(imagemin())
		.pipe(gulp.dest('app/img/'));
});

// ОЧИСТКА ПАПКИ DIST
function clean(done) {
	del.sync('dist/**/*');
	done();
}

// // СБОРКА ПРОЕКТА
function build(done){
	const buildCss = gulp.src('app/css/**/*.css')
	.pipe(gulp.dest('./dist/css/'));

	const buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts/'));

	const buildJs = gulp.src('app/js/**/*.js')
	.pipe(gulp.dest('dist/js/'));

	const buildImg = gulp.src('app/img/**/*')
	.pipe(gulp.dest('dist/img/'));

	const buildIco = gulp.src('app/favicon/**/*.*')
	.pipe(gulp.dest('dist/favicon/'));

	done();
}

gulp.task('htmlMin', () => {
	return gulp.src('app/**/*.html')
	  .pipe(htmlmin({ collapseWhitespace: true }))
	  .pipe(gulp.dest('dist'));
  });

gulp.task('default', gulp.parallel('watch', 'server', 'sass', 'styles', 'scripts'));
gulp.task('project', gulp.series(clean, 'img', 'sass', 'styles', 'scripts', 'htmlMin', build));





