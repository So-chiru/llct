const { watch, src, dest, parallel } = require('gulp')
const pug = require('gulp-pug')

const concat = require('gulp-concat')
const babel = require('gulp-babel')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const html = () => {
  return src('src/views/*.pug')
    .pipe(pug())
    .pipe(dest('dist/'))
}

const css = () => {
  return src('src/styles/*.scss')
    .pipe(concat('mikan.min.css'))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(dest('dist/'))
}

const js = () => {
  return src('src/js/*.js')
    .pipe(concat('mikan.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(dest('dist/'))
}

const watchdog = () => {
  watch(['src/js/*.js'], js)
  watch(['src/styles/*.scss'], css)
  watch(['src/views/*.pug'], html)
}

exports.default = parallel(html, css, js, watchdog)
exports.build = parallel(html, css, js)
