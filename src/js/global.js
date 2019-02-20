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
