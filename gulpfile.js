const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const stylus = require('gulp-stylus');

gulp.task('run-lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('run-test', () => {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('run-nodemon', () => {
  return nodemon({
    script: 'index.js',
    ext: 'js'
  });
});

gulp.task('run-stylus', () => {
  return gulp.src('./styles/master.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('default', ['run-stylus']);
gulp.task('dev', ['run-stylus', 'run-nodemon']);
gulp.task('test', ['run-lint', 'run-test']);
