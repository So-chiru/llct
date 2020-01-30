const { watch, src, dest, parallel } = require('gulp')
const pug = require('gulp-pug')

const concat = require('gulp-concat')
const babel = require('gulp-babel')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const connect = require('gulp-connect')
const imagemin = require('gulp-imagemin')
sass.compiler = require('node-sass')

const html = () =>
  src('src/views/*.pug')
    .pipe(pug())
    .pipe(dest('dist/'))
    .pipe(connect.reload())
const css = () =>
  src('src/styles/**/*.scss')
    .pipe(concat('mikan.min.css'))
    .pipe(
      sass({
        includePaths: [__dirname + '/src/styles/']
      })
    )
    .pipe(cleanCSS())
    .pipe(dest('dist/'))
    .pipe(connect.reload())
const images = () =>
  src('src/data/images/*')
    .pipe(imagemin())
    .pipe(dest('dist/assets'))
const js = () =>
  src('src/js/**/*.js')
    .pipe(concat('mikan.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(dest('dist/'))
    .pipe(connect.reload())

const watchdog = () => {
  watch(['src/js/**/*.js'], js)
  watch(['src/styles/**/*.scss'], css)
  watch(['src/views/*.pug'], html)
  watch(['src/data/images/*'], images)
}

const server = () => {
  connect.server({
    root: 'dist',
    livereload: true
  })
}

exports.build = parallel(html, css, js, images)
exports.default = parallel(this.build, server, watchdog)
