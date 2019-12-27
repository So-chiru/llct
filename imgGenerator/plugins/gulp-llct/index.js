const PluginError = require('plugin-error')
const through = require('through2')
const pug = require('pug')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const log = require('fancy-log')

let lBrowser
let lastAccess = null
let pugCache = fs.readFileSync(
  path.join(__dirname, '../../../src/imgGenerator/', 'index.pug')
)

let saveBase = path.join(__dirname, '../../../calls/')

if (!fs.existsSync(path.join(__dirname, '../../../calls'))) {
  fs.mkdirSync(path.join(__dirname, '../../../calls'))
}

let copiedAssets = false
const copyRequireAsset = () => {
  if (copiedAssets) {
    return true
  }

  try {
    fs.writeFileSync(
      saveBase + 'karaoke.js',
      fs.readFileSync(
        path.join(__dirname, '../../../dist/js/', 'karaoke.min.js')
      )
    )
    fs.writeFileSync(
      saveBase + 'yosoro.min.css',
      fs.readFileSync(path.join(__dirname, '../../../dist/', 'yosoro.min.css'))
    )

    CallLists.__parsed = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../../dist/data/', 'lists.json'))
    )
  } catch (e) {
    return false
  }

  copiedAssets = true
  return true
}

let CallLists = {
  __parsed: null,
  find: id => {
    let groups = Object.keys(CallLists.__parsed)
    let groupsLength = groups.length
    for (var i = 0; i < groupsLength; i++) {
      let groupName = groups[i]
      let group = CallLists.__parsed[groupName]

      let songsKeys = Object.keys(group.collection)
      let skLength = songsKeys.length

      for (var s = 0; s < skLength; s++) {
        let songName = songsKeys[s]
        let song = group.collection[songsKeys[s]]

        if (song.id === id) {
          return {
            title: songName,
            group: groupName,
            ...song,
            artist: group.meta.artists[song.artist || 0]
          }
        }
      }
    }

    return null
  }
}

let genBrowser = async () => {
  lBrowser = await puppeteer.launch()
  checkLastAccess()
}

let checkLastAccess = () => {
  if (lastAccess && lastAccess + 10000 > Date.now()) {
    lastAccess = null
    lBrowser.close()

    return true
  }

  setInterval(() => {
    checkLastAccess()
  }, 2000)

  return false
}

module.exports = () => {
  let capturedImages = 0
  return through.obj(
    async (file, encoding, callback) => {
      if (!copyRequireAsset()) {
        callback(
          new PluginError('gulp-llct', 'Failed to copy required assets.')
        )
      }

      if (file.isNull()) {
        callback(null, file)
        return
      }

      if (file.basename.indexOf('lists') > -1) {
        callback(null, null)
        return
      }

      if (file.extname.slice(1).toLowerCase() !== 'json') {
        callback(new PluginError('gulp-llct', 'Given file is not json file.'))
        return
      }

      let fileNameSplit = file.path.split('/')
      let fileId = fileNameSplit[fileNameSplit.length - 2]
      let metadata = CallLists.find(fileId)

      if (!metadata) {
        callback(null, null)
        return
      }

      let PResult = pug.render(pugCache, {
        karaokeData: file.contents,
        metadata: metadata,
        editAt: file.stat.mtimeMs
      })

      let fileWPath = saveBase + 'index.html'
      await fs.writeFileSync(fileWPath, PResult)

      if (!lBrowser) {
        await genBrowser()
      }

      try {
        const page = await lBrowser.newPage()
        await page.goto('file://' + fileWPath)
        await page.setViewport({
          width: 3232,
          height: 2100
        })
        await page.screenshot({ path: './calls/__capture.png' })
        await page.goto('about:blank')
        await page.close()

        file.contents = await fs.readFileSync('./calls/__capture.png')
        file.basename = 'call.png'

        lastAccess = Date.now()

        capturedImages++
      } catch (e) {
        callback(new PluginError('gulp-llct', e.message))
      }

      callback(null, file)
    },
    cb => {
      log(
        `gulp-llct: Captured ${capturedImages} page${
          capturedImages > 1 ? 's' : ''
        }.`
      )

      cb()
    }
  )
}
