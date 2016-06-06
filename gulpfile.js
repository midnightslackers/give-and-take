const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

gulp.task('run-lint', () => {
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('run-test', () => {
  gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('run-nodemon', () => {
  nodemon({
    script: 'index.js',
    ext: 'js',
    tasks: ['run-lint', 'run-test']
  });
});

// gulp.task('default', ['run-nodemon']);
gulp.task('dev', ['run-nodemon']);
gulp.task('test', ['run-lint', 'run-test']);
