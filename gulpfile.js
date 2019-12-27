const pkgs = require('./package.json')
const gulp = require('gulp')
const LLCTImgfy = require('./src/imgGenerator/plugins/gulp-llct/index')
const fileCache = require('gulp-file-cache')
const pngQuant = require('imagemin-pngquant')
const jpegTran = require('imagemin-jpegtran')

const plugins = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies'],
  rename: {
    'gulp-uglify-es': 'uglify',
    'gulp-json-minify': 'jsonm'
  }
})

let filecaches = new fileCache()
let callFilecaches = new fileCache('.llct-call-caches')
plugins.sass.compiler = require('node-sass')

gulp.task('sass', function () {
  return gulp
    .src(pkgs.srcs.sass + '**/*.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('yosoro.css'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

gulp.task('sass:min', function () {
  return gulp
    .src(pkgs.srcs.sass + '**/*.scss')
    .pipe(filecaches.filter())
    .pipe(plugins.concat('yosoro.min.css'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.uglifycss({ maxLineLen: 1000, expandVars: true }))
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist'))
})

gulp.task('js', () => {
  return gulp
    .src([pkgs.srcs.js + '**/*.js'])
    .pipe(filecaches.filter())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(plugins.sourcemaps.write())
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('js:min', () => {
  return gulp
    .src([pkgs.srcs.js + '**/*.js'])
    .pipe(
      plugins.rename(p => {
        p.extname = '.min.js'
      })
    )
    .pipe(filecaches.filter())
    .pipe(plugins.babel({ presets: ['@babel/env'] }))
    .pipe(
      plugins.uglify.default({
        mangle: true
      })
    )
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('json:min', () => {
  return gulp
    .src([pkgs.srcs.datas + '**/*.json'])
    .pipe(filecaches.filter())
    .pipe(plugins.jsonm())
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/data'))
})

gulp.task('pug', () => {
  return gulp
    .src([pkgs.srcs.pug + '**/*.pug'])
    .pipe(
      plugins.pug({
        doctype: 'html',
        pretty: false
      })
    )
    .pipe(gulp.dest('./dist'))
})

gulp.task('images', () => {
  return gulp
    .src(pkgs.srcs.datas + '**/*.{png,jpg,jpeg,svg}')
    .pipe(filecaches.filter())
    .pipe(
      plugins.imagemin([
        pngQuant({
          quality: [0.4, 0.7],
          strip: true,
          dithering: 0.35,
          speed: 1
        }),
        jpegTran({
          progressive: true
        })
      ])
    )
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/data'))
    .pipe(
      plugins.webp({
        lossless: false
      })
    )
    .pipe(filecaches.cache())
    .pipe(
      plugins.rename(p => {
        p.extname = '.webp'
      })
    )
    .pipe(gulp.dest('./dist/data'))
})

gulp.task('callImgAssets', () => {
  return gulp.src(pkgs.srcs.imgs + 'assets/**.*').pipe(gulp.dest('./calls'))
})

gulp.task('callImgTransfer', () => {
  return gulp
    .src(pkgs.srcs.datas + '**/*.json')
    .pipe(callFilecaches.filter())
    .pipe(callFilecaches.cache())
    .pipe(LLCTImgfy())
    .pipe(
      plugins.imagemin([
        pngQuant({
          quality: [0.5, 0.9],
          strip: true,
          dithering: 0.25,
          speed: 1
        })
      )
      .pipe(
        plugins.rename(p => {
          p.extname = '.webp'
        })
      )
      .pipe(gulp.dest('./dist/data'))
  )
})

gulp.task('assets', () => {
  return gulp
    .src([
      pkgs.srcs.datas + '**/*.*',
      `!${pkgs.srcs.datas}**/*.{png,jpg,jpeg,svg,json}`
    ])
    .pipe(callFilecaches.filter())
    .pipe(callFilecaches.cache())
    .pipe(gulp.dest('./dist/data'))
})

gulp.task('root_assets', () => {
  return gulp
    .src(pkgs.srcs.rdatas + '**/*')
    .pipe(callFilecaches.filter())
    .pipe(callFilecaches.cache())
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', () => {
  plugins.livereload.listen()
  gulp.watch(pkgs.srcs.sass + '**/*.scss', gulp.series(['sass', 'sass:min']))
  gulp.watch(pkgs.srcs.js + '**/*.js', gulp.series(['js', 'js:min']))
  gulp.watch(pkgs.srcs.pug + '**/*.pug', gulp.series('pug'))
  gulp.watch(
    pkgs.srcs.datas + '**/*.{png,jpg,jpeg,svg}',
    gulp.series(['images'])
  )
  gulp.watch(pkgs.srcs.datas + '**/*.json', gulp.series('json:min'))
  gulp.watch(
    [
      pkgs.srcs.datas + '**/*.*',
      `!${pkgs.srcs.datas}**/*.{png,jpg,jpeg,svg, json}`
    ],
    gulp.series('assets')
  )

  gulp.watch(pkgs.srcs.datas + '**/*.json', gulp.series('callImgTransfer'))
  gulp.watch(pkgs.srcs.imgs + 'assets/**.*', gulp.series('callImgAssets'))
  gulp.watch([pkgs.srcs.rdatas + '**/*.*'], gulp.series('root_assets'))

  return gulp.src('./dist').pipe(
    plugins.webserver({
      livereload: {
        enabled: true,
        port: 29102
      },
      host: '0.0.0.0',
      port: pkgs.webSVPort,
      directoryListing: false,
      open: false
    })
  )
})

gulp.task(
  'build',
  gulp.series(
    'assets',
    'root_assets',
    'sass',
    'sass:min',
    'js',
    'js:min',
    'json:min',
    'images',
    'callImgAssets',
    'callImgTransfer',
    'pug',
  )
)

gulp.task(
  'init_run',
  gulp.series(
    'assets',
    'root_assets',
    'sass',
    'sass:min',
    'js',
    'js:min',
    'json:min',
    'images',
    'callImgAssets',
    'callImgTransfer',
    'pug',
    'watch'
  )
)

gulp.task('default', gulp.series('build', 'watch'))
