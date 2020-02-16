const { watch, src, dest, parallel } = require('gulp')
const pug = require('gulp-pug')

const concat = require('gulp-concat')
const babel = require('gulp-babel')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const connect = require('gulp-connect')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const argv = require('yargs').argv
sass.compiler = require('node-sass')

const html = () =>
  src('src/views/*.pug')
    .pipe(
      pug({
        locals: {
          dev:
            !argv.production &&
            !argv.prod &&
            process.env.NODE_ENV !== 'production'
        }
      })
    )
    .pipe(dest('public/'))
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
    .pipe(dest('public/'))
    .pipe(connect.reload())
const images = () =>
  src('src/data/images/**/*')
    .pipe(imagemin())
    .pipe(dest('public/assets'))
const sounds = () => src('src/data/sounds/**/*').pipe(dest('public/assets'))
const root = () => src('src/root/**/*').pipe(dest('public/'))
const js = () =>
  src('src/js/**/*.js')
    .pipe(concat('mikan.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(dest('public/'))
    .pipe(connect.reload())
const jsBuild = () =>
  src('src/js/**/*.js')
    .pipe(concat('mikan.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(uglify())
    .pipe(dest('public/'))

const watchdog = () => {
  watch(['src/js/**/*.js'], js)
  watch(['src/styles/**/*.scss'], css)
  watch(['src/views/*.pug'], html)
  watch(['src/root/**/*'], root)
  watch(['src/data/sounds/**/*'], sounds)
  watch(['src/data/images/**/*'], images)
}

const server = () => {
  connect.server({
    root: 'public',
    livereload: true,
    host: '0.0.0.0'
  })
}

exports.build = parallel(html, css, jsBuild, root, images, sounds)
exports.build_o = parallel(html, css, js, root, images, sounds)
exports.default = parallel(this.build_o, server, watchdog)
