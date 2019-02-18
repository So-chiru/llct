const pkgs = require('./package.json')
const gulp = require('gulp')
const fileCache = require('gulp-file-cache')
let uglify = require('gulp-uglify-es').default

const plugins = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies'],
  rename: {
    'gulp-uglify-es': 'uglify'
  }
})

let filecaches = new fileCache()
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
    .pipe(plugins.jsonminify())
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
      plugins.imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 7,
        svgoPlugins: [{ removeViewBox: false }],
        verbose: true,
        use: []
      })
    )
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/data'))
})

gulp.task('assets', () => {
  return gulp
    .src([
      pkgs.srcs.datas + '**/*.*',
      `!${pkgs.srcs.datas}**/*.{png,jpg,jpeg,svg,json}`
    ])
    .pipe(filecaches.filter())
    .pipe(filecaches.cache())
    .pipe(gulp.dest('./dist/data'))
})

gulp.task('root_assets', () => {
  return gulp.src(pkgs.srcs.rdatas + '**/*').pipe(gulp.dest('./dist'))
})

gulp.task('watch', () => {
  plugins.livereload.listen()
  gulp.watch(pkgs.srcs.sass + '**/*.scss', gulp.series(['sass', 'sass:min']))
  gulp.watch(pkgs.srcs.js + '**/*.js', gulp.series(['js', 'js:min']))
  gulp.watch(pkgs.srcs.pug + '**/*.pug', gulp.series('pug'))
  gulp.watch(pkgs.srcs.datas + '**/*.{png,jpg,jpeg,svg}', gulp.series('images'))
  gulp.watch(pkgs.srcs.datas + '**/*.json', gulp.series('json:min'))
  gulp.watch(
    [
      pkgs.srcs.datas + '**/*.*',
      `!${pkgs.srcs.datas}**/*.{png,jpg,jpeg,svg, json}`
    ],
    gulp.series('assets')
  )
  gulp.watch([pkgs.srcs.rdatas + '**/*.*'], gulp.series('root_assets'))

  return gulp.src('./dist').pipe(
    plugins.webserver({
      livereload: true,
      port: pkgs.webSVPort,
      directoryListing: false,
      open: false
    })
  )
})

gulp.task('default', gulp.series('watch'))

gulp.task(
  'build',
  gulp.series(
    'sass',
    'sass:min',
    'js',
    'js:min',
    'json:min',
    'pug',
    'images',
    'assets',
    'root_assets'
  )
)

gulp.task(
  'init_run',
  gulp.series(
    'sass',
    'sass:min',
    'js',
    'js:min',
    'json:min',
    'pug',
    'images',
    'assets',
    'root_assets',
    'watch'
  )
)
