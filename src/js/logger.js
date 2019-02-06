var i = [
  {
    n: 'Karaoke',
    c: 'color: #23cbff'
  },

  {
    n: 'KaraokeEditor',
    c: 'color: #3565d6'
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
