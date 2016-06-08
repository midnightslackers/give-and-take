const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const stylus = require('gulp-stylus');
const uglify = require('gulp-uglify');

gulp.task('run-clean', () => {
  return gulp.src('./public')
    .pipe(clean());
});

gulp.task('run-concat-uglify', () => {
  return gulp.src(['./scripts/master.js'])
    .pipe(concat('master.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('run-imagemin', () => {
  return gulp.src('./images/*')
	  .pipe(imagemin())
	  .pipe(gulp.dest('./public/images'));
});

gulp.task('run-lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('run-nodemon', () => {
  return nodemon({
    script: 'index.js',
    ext: 'js'
  });
});

gulp.task('run-stylus', () => {
  return gulp.src('./styles/master.styl')
    .pipe(stylus({compress: true}))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('run-test', () => {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('watch-images', () => {
  return gulp.watch(['./images/*'], ['run-imagemin']);
});

gulp.task('watch-scripts', () => {
  return gulp.watch(['./scripts/**/*.js'], ['run-concat-uglify']);
});

gulp.task('watch-styles', () => {
  return gulp.watch(['./styles/**/*.styl'], ['run-stylus']);
});

gulp.task('build', ['run-clean'], () => {
  return gulp.start(['run-stylus', 'run-concat-uglify', 'run-imagemin']);
});

gulp.task('dev', ['build'], () => {
  return gulp.start(['run-nodemon', 'watch-images', 'watch-styles', 'watch-scripts']);
});

gulp.task('test', ['build'], () => {
  return gulp.start(['run-lint', 'run-test']);
});
