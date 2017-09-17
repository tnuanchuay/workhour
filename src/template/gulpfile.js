let gulp = require('gulp')
let run = require('gulp-run')
let debug = require('gulp-debug')
gulp.task('default', () => {
    run('yarn build')
})