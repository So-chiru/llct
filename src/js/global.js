var popsHeart = {
  __sp: typeof window.history.pushState !== 'undefined',
  __q: () => {
    var match
    var pl = /\+/g
    var search = /([^&=]+)=?([^&]*)/g
    var decode = function (s) {
      return decodeURIComponent(s.replace(pl, ' '))
    }

    var query = window.location.search.substring(1)
    var urlParams = {}

    while ((match = search.exec(query))) {
      urlParams[decode(match[1])] = decode(match[2])
    }

    return urlParams
  },
  set: function (key, value, title) {
    if (!popsHeart.__sp) throw "This browser doesn't support pushState API."
    var nsObj = popsHeart.__q() || {}
    nsObj[key] = value
    var finalizedString = ''

    for (var k in nsObj) {
      finalizedString += k + '=' + nsObj[k] + '&'
    }

    if (finalizedString.slice(-1) == '&') {
      finalizedString = finalizedString.substr(0, finalizedString.length - 1)
    }
    window.history.pushState(nsObj, title, '/?' + finalizedString)
  },

  get: function (key) {
    return urlQueryParams(key)
  }
}

var formatBytes = (a, b) => {
  if (a == 0) return '0 Bytes'
  var c = 1024

  var d = b || 2

  var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  var f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

var dataYosoro = {
  isStorageSupport: window.localStorage != null,
  get: function (...args) {
    var rtnedData = dataYosoro[
      dataYosoro.isStorageSupport ? '__storageG' : '__cookieG'
    ](...args)

    if (rtnedData === 'true') return true
    if (rtnedData === 'false') return false
    if (typeof rtnedData === 'undefined' || rtnedData === null) return null

    return rtnedData
  },

  __cookieG: key => {
    for (
      var cookies = document.cookie.split(';'), i = 0;
      i < cookies.length;
      i++
    ) {
      var x = cookies[i].substr(0, cookies[i].indexOf('='))
      var y = cookies[i].substr(cookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x === key) {
        return unescape(y)
      }
    }
  },

  __storageG: key => {
    try {
      return localStorage.getItem(key) || null
    } catch (e) {
      logger(1, 'r', 'error on data.__stroageG ' + e.message, 'e')
      return null
    }
  },

  __storageS: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch (e) {
      logger(1, 'r', 'error on data.__storageS ' + e.message, 'e')
      return false
    }
  },

  __cookieS: (key, value) => {
    document.cookie = key + '=' + escape(value)
  },

  set: function (...args) {
    dataYosoro[dataYosoro.isStorageSupport ? '__storageS' : '__cookieS'](
      ...args
    )
  },

  clear: function (key) {
    if (typeof key !== 'undefined' && key !== null) {
      dataYosoro.set(key, null)
    } else {
      dataYosoro.isStorageSupport
        ? window.localStorage.clear()
        : (document.cookie = '')
    }
  }
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

  listen: (k, fn, parent, options) => {
    if (typeof parent === 'undefined' || parent == null) parent = window

    if (k.constructor === Array) {
      for (var i = 0; i < k.length; i++) {
        Sakurauchi.listen(k[i], fn, parent)
      }
      return
    }

    var specializedID = typeof parent.id !== 'undefined' ? parent.id : ''

    parent.addEventListener(
      k,
      (...evs) => {
        Sakurauchi.run(k + specializedID, ...evs)
      },
      options || null
    )

    return Sakurauchi.add(k + specializedID, fn)
  },

  delisten: (k, fi, pr) => {
    if (typeof pr === 'undefined' || pr == null) pr = window

    if (k.constructor === Array) {
      for (var i = 0; i < k.length; i++) {
        Sakurauchi.delisten(k[i], fi, pr)
      }
      return
    }

    var specializedID = typeof pr.id !== 'undefined' ? pr.id : ''
    pr.removeEventListener(k)
    return Sakurauchi.remove(k + specializedID, fi)
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

if (typeof $ !== 'undefined') {
  $(document).ready(() => {
    if (dataYosoro.get('tatenshi')) document.body.classList.add('dark')
  })
}

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

var _glb_ShowPopup = (icon, msg) => {
  document.getElementById('__popup_icon').innerHTML = icon || 'offline_bolt'
  document.getElementById('__popup_txt').innerHTML = msg || '메세지 없음.'
  document.getElementsByClassName('offline_popup')[0].style.opacity = 1
  document.getElementsByClassName('offline_popup')[0].style.display = 'flex'

  setTimeout(() => {
    document.getElementsByClassName('offline_popup')[0].style.opacity = 0
    document.getElementsByClassName('offline_popup')[0].style.display = 'none'
  }, 4800)
}

window.dataLayer = window.dataLayer || []
function gtag () {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'UA-111995531-2')
