/* global $, location */

var cookieYosoro = {
  get: function (key) {
    var cookies = document.cookie.split(';')
    var i

    for (i = 0; i < cookies.length; i++) {
      var x = cookies[i].substr(0, cookies[i].indexOf('='))
      var y = cookies[i].substr(cookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x === key) {
        return unescape(y)
      }
    }
  },

  set: function (key, value) {
    document.cookie = key + '=' + escape(value)
  },

  clear: function (key) {}
}

var urlQueryParams = function (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

let Sakurauchi = {
  __sot: {},
  add: (k, fn) => {
    if (!Sakurauchi.__sot[k]) {
      Sakurauchi.__sot[k] = []
    }

    if (typeof fn !== 'function') throw 'Second parameter is not a function.'

    Sakurauchi.__sot[k].push(fn)

    return Sakurauchi.__sot[k].length - 1
  },

  remove: (k, fi) => {
    if (typeof fi !== 'undefined') {
      return Sakurauchi.__sot[k].splice(fi, 1)
    }

    if (
      typeof Sakurauchi.__sot[k] === 'undefined' ||
      Sakurauchi.__sot[k] === null
    ) {
      return 0
    }
    for (var _i = 0; _i < Sakurauchi.__sot[k].length; _i++) {
      Sakurauchi.__sot[k].splice(_i, 1)
    }
  },

  listen: (k, fn, pr) => {
    if (typeof pr === 'undefined') pr = window

    if (k.constructor === Array) {
      for (var i = 0; i < k.length; i++) {
        Sakurauchi.listen(k[i], fn, pr)
      }
      return
    }

    pr.addEventListener(k, () => Sakurauchi.run(k))
    return Sakurauchi.add(k, fn)
  },

  delisten: (k, fi, pr) => {
    if (typeof pr === 'undefined') pr = window

    if (k.constructor === Array) {
      for (var i = 0; i < k.length; i++) {
        Sakurauchi.delisten(k[i], fi, pr)
      }
      return
    }

    pr.removeEventListener(k)
    return Sakurauchi.remove(k, fi)
  },

  run: (k, ...datas) => {
    logger(2, 's', 'Sakurauchi.run called : ' + k)
    for (var _i = 0; _i < Sakurauchi.__sot[k].length; _i++) {
      try {
        Sakurauchi.__sot[k][_i](...datas)
      } catch (e) {
        logger(
          2,
          's',
          '[' +
            k +
            '] Error occured while running task #' +
            _i +
            ' : ' +
            e.message,
          'e'
        )
      }
    }
  }
}

$(document).ready(() => {
  if (cookieYosoro.get('tatenshi') === 'true') $(document.body).addClass('dark')
})

var i = [
  {
    n: 'Karaoke',
    c: 'color: #23cbff'
  },

  {
    n: 'KaraokeEditor',
    c: 'color: #3565d6'
  },

  {
    n: 'Main',
    c: 'color: #3eddcb'
  }
]

const kIntvlogger = (e, rs, msg, t) => {
  var rx = ''
  if (rs.indexOf('s') !== -1) {
    rx = '<'
  }
  if (rs.indexOf('r') !== -1) {
    rx += '->'
  }
  if (rx === '<') rx += '-'

  var tType = {
    i: 'color: #000',
    w: 'background: #ffc700; color: #323232',
    e: 'background: #ff1500; color: #fff'
  }
  var consoleType = {
    i: 'log',
    w: 'warn',
    e: 'error'
  }
  console[consoleType[t] || 'log'](
    `[${(t || 'i').toUpperCase()}] %c${i[e].n} %c${rx} %c${msg}`,
    i[e].c,
    'color: #a0a0a0',
    tType[t] || tType['i']
  )
}

window.logger = kIntvlogger

window.dataLayer = window.dataLayer || []
function gtag () {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'UA-111995531-2')
