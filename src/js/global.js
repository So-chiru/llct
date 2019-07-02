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

var __dYs_preSpace = /^\s+|\s+$/g
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
      x = x.replace(__dYs_preSpace, '')
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

var __url_replF = /[[]/
var __url_replS = /[\]]/
var __url_replPL = /\+/g
var urlQueryParams = function (name) {
  name = name.replace(__url_replF, '\\[').replace(__url_replS, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(__url_replPL, ' '))
}

let Sakurauchi = {
  __sot: {},
  add: (k, fn) => {
    if (typeof Sakurauchi.__sot[k] === 'undefined' || !Sakurauchi.__sot[k]) {
      Sakurauchi.__sot[k] = []
    }

    if (typeof fn !== 'function') throw 'Second parameter is not a function.'

    Sakurauchi.__sot[k].push(fn)

    return Sakurauchi.__sot[k].length - 1
  },

  remove: (k, fi) => {
    if (
      typeof Sakurauchi.__sot[k] === 'undefined' ||
      Sakurauchi.__sot[k] === null
    ) {
      return 0
    }

    if (typeof fi !== 'undefined') {
      return Sakurauchi.__sot[k].splice(fi, 1)
    }

    if (fi == 'a') {
      let z = Sakurauchi.__sot[k].length
      while (z--) {
        Sakurauchi.__sot[k].splice(z, 1)
      }
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

  delisten: (k, fi, fn, pr) => {
    if (typeof pr === 'undefined' || pr == null) pr = window

    if (k.constructor === Array) {
      for (var i = 0; i < k.length; i++) {
        Sakurauchi.delisten(k[i], fi, pr)
      }
      return
    }

    var specializedID = typeof pr.id !== 'undefined' ? pr.id : ''
    pr.removeEventListener(k, null, true)
    return Sakurauchi.remove(k + specializedID, fi)
  },

  run: (k, ...datas) => {
    logger(2, 's', 'Sakurauchi.run called : ' + k)
    if (typeof Sakurauchi.__sot[k] === 'undefined') return
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
    var mtcM = window.matchMedia('screen and (prefers-color-scheme: dark)')

    mtcM.addListener(r => {
      document.body.classList[r.matches ? 'add' : 'remove']('dark')
    })

    if (dataYosoro.get('tatenshi') || mtcM.matches) {
      document.body.classList.add('dark')
    }
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

var __kItv_tType = {
  i: 'color: unset',
  w: 'background: #ffc700; color: #323232',
  e: 'background: #ff1500; color: #fff'
}
var __kItv_cType = {
  i: 'log',
  w: 'warn',
  e: 'error'
}

const kIntvlogger = (e, rs, msg, t) => {
  var rx = ''
  if (rs.indexOf('s') !== -1) {
    rx = '<'
  }
  if (rs.indexOf('r') !== -1) {
    rx += '->'
  }
  if (rx === '<') rx += '-'

  console[__kItv_cType[t] || 'log'](
    `[${(t || 'i').toUpperCase()}] %c${i[e].n} %c${rx} %c${msg}`,
    i[e].c,
    'color: #a0a0a0',
    __kItv_tType[t] || __kItv_tType['i']
  )
}

const __llct_ts_func = sec => {
  sec = isNaN(sec) ? 0 : Math.floor(sec)
  return (
    (sec >= 60 ? Math.floor(sec / 60) : '0') +
    ' : ' +
    (sec % 60 < 10 ? '0' : '') +
    (sec % 60)
  )
}

window.numToTS = __llct_ts_func
window.logger = kIntvlogger

var _glb_popupTimeout
var _glb_ShowPopup = (icon, msg, fn) => {
  if (_glb_popupTimeout) clearTimeout(_glb_popupTimeout)
  document.getElementById('__popup_icon').innerHTML = icon || 'offline_bolt'
  document.getElementById('__popup_txt').innerHTML = msg || '메세지 없음.'
  document.getElementsByClassName('offline_popup')[0].style.opacity = 1
  document.getElementsByClassName('offline_popup')[0].style.display = 'flex'

  document.getElementsByClassName('offline_popup')[0].onclick = () => {
    if (typeof fn === 'function') fn()
    _glb_closePopup()
  }

  _glb_popupTimeout = setTimeout(_glb_closePopup, 4800)
}

var _glb_closePopup = () => {
  document.getElementsByClassName('offline_popup')[0].style.opacity = 0
  document.getElementsByClassName('offline_popup')[0].style.display = 'none'
  if (_glb_popupTimeout) clearTimeout(_glb_popupTimeout)
}

window.dataLayer = window.dataLayer || []
function gtag () {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'UA-111995531-2')
