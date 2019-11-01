var popsHeart = {
  __support: typeof window.history.pushState !== 'undefined',
  __getQueries: () => {
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
    if (!popsHeart.__support) {
      throw "This browser doesn't support pushState API."
    }
    var nsObj = popsHeart.__getQueries() || {}
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

const webpSupports = () => {
  return new Promise(res => {
    const webP = new Image()
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    webP.onload = webP.onerror = function () {
      res(webP.height === 2)
    }
  })
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
      logger.error(1, 'r', 'error on data.__stroageG ' + e.message)
      return null
    }
  },

  __storageS: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch (e) {
      logger.error(1, 'r', 'error on data.__storageS ' + e.message)
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

    if (fi == 'a') {
      let z = Sakurauchi.__sot[k].length
      while (z--) {
        Sakurauchi.__sot[k].splice(z, 1)
      }
      return z
    }

    if (typeof fi !== 'undefined') {
      return Sakurauchi.__sot[k].splice(fi, 1)
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
        Sakurauchi.run(
          k + (specializedID !== '' ? ' < ' + specializedID : ''),
          ...evs
        )
      },
      options || null
    )

    return Sakurauchi.add(
      k + (specializedID !== '' ? ' < ' + specializedID : ''),
      fn
    )
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
    return Sakurauchi.remove(
      k + (specializedID !== '' ? ' < ' + specializedID : ''),
      fi
    )
  },

  run: (k, ...datas) => {
    logger.info(2, 's', 'Sakurauchi.run called : ' + k)
    if (typeof Sakurauchi.__sot[k] === 'undefined') return
    for (var _i = 0; _i < Sakurauchi.__sot[k].length; _i++) {
      try {
        Sakurauchi.__sot[k][_i](...datas)
      } catch (e) {
        logger.error(
          2,
          's',
          '[' +
            k +
            '] Error occured while running task #' +
            _i +
            ' : ' +
            e.message
        )
      }
    }
  }
}

Sakurauchi.listen('DOMContentLoaded', () => {
  var mtcM = window.matchMedia('screen and (prefers-color-scheme: dark)')

  mtcM.addListener(r => {
    document.body.classList[r.matches ? 'add' : 'remove']('dark')
  })

  if (dataYosoro.get('tatenshi') || mtcM.matches) {
    document.body.classList.add('dark')
  }

  Sakurauchi.run('LLCTDOMLoad')
})

Sakurauchi.listen('load', () => {
  Sakurauchi.run('LLCTPGLoad')
})

var logger = {
  logs: {
    i: {
      full: 'log',
      style: 'color: unset'
    },

    w: {
      full: 'war',
      style: 'background: #ffc700; color: #323232'
    },

    e: {
      full: 'error',
      style: 'background: #ff1500; color: #fff'
    }
  },

  namespace: [
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
  ],

  action: (type, namespace, actor, text) => {
    let act_indicator = ''

    if (actor.indexOf('s') > -1) {
      act_indicator = '<-'
    }

    if (actor.indexOf('r') > -1) {
      act_indicator = '>'
    }

    let type_object = logger.logs[type]

    console[type_object.full](
      `[${type.toUpperCase()}] %c${
        logger.namespace[namespace].n
      } %c${act_indicator} %c${text}`,
      logger.namespace[namespace].c,
      type_object.style,
      type_object.style
    )
  },

  info: (namespace, actor, text) => logger.action('i', namespace, actor, text),
  warn: (namespace, actor, text) => logger.action('w', namespace, actor, text),
  error: (namespace, actor, text) => logger.action('e', namespace, actor, text)
}

/*
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
    `[${(t || 'i').toUpperCase()}] %c${[e].n} %c${rx} %c${msg}`,
    i[e].c,
    'color: #a0a0a0',
    __kItv_tType[t] || __kItv_tType['i']
  )
}
*/

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
window.logger = logger

var Popup = {
  __timeout_early: null,
  __timeout: null,
  __toff: false,
  show: (icon, msg, fn) => {
    if (Popup.__timeout) clearTimeout(Popup.__timeout)
    if (Popup.__timeout_early) clearTimeout(Popup.__timeout_early)

    document.querySelector('llct-pop').style.animation = 'null'

    document.getElementById('__popup_icon').innerHTML = icon || 'offline_bolt'
    document.getElementById('__popup_txt').innerHTML = msg || '메세지 없음.'
    document.querySelector('llct-pop').style.opacity = 1
    document.querySelector('llct-pop').style.display = 'flex'

    document.querySelector('llct-pop').onclick = () => {
      if (typeof fn === 'function') fn()

      if (Popup.__toff) return true
      Popup.closeSmooth()
    }

    Popup.__timeout_early = setTimeout(() => {
      Popup.__toff = true
    }, 4000)
    Popup.__timeout = setTimeout(Popup.closeSmooth, 4000)
  },

  close: () => {
    document.querySelector('llct-pop').style.opacity = 0
    document.querySelector('llct-pop').style.display = 'none'

    if (Popup.__timeout) clearTimeout(Popup.__timeout)
    if (Popup.__timeout_early) clearTimeout(Popup.__timeout_early)
  },

  closeSmooth: () => {
    document.querySelector('llct-pop').style.animation =
      'disappear_popup_r 800ms cubic-bezier(0.19, 1, 0.22, 1)'    
  
    setTimeout(() => {
      Popup.close()
    }, 790)
  }
}

window.dataLayer = window.dataLayer || []
function gtag () {
  dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'UA-111995531-2')
