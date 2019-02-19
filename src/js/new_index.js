const pagePlayerAnimation = (index, nextIndex, direction) => {
  yohane[nextIndex === 2 ? 'shokan' : 'giran']()
}

const timeString = sec => {
  sec = Math.floor(sec)
  return (
    (sec >= 60 ? Math.floor(sec / 60) : '0') +
    ' : ' +
    (sec % 60 < 10 ? '0' : '') +
    (sec % 60)
  )
}

let callLists = []
let frameWorks
let audioVolumeFrame = null
let audioVolumeFunction = () => {}
const artistLists = ['Aqours', 'Saint Snow', 'Saint Aqours Snow']

let yohaneNoDOM = {
  shokan: () => {
    $('.player').css('transition', 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)')
    $('.player').removeClass('hide')
    $('.player').addClass('show')
  },

  giran: () => {
    $('.player').css(
      'transition',
      'all 0.5s cubic-bezier(0.95, 0.05, 0.795, 0.035)'
    )
    $('.player').removeClass('show')
    $('.player').addClass('hide')
  },

  dekekuni: () => {
    $('.player_bg').addClass('show')
    $('.player').addClass('dekai')
  },

  chiisakuni: () => {
    $('.player_bg').removeClass('show')
    $('.player').removeClass('dekai')
  },

  initialize: id => {
    var meta = getFromLists(id)

    document.getElementById('album_meta').src =
      (urlQueryParams('local') !== null ? './' : 'https://cdn.lovelivec.kr/') +
      '/data/' +
      id +
      '/bg.png'

    document.getElementById('title_meta').innerText = meta[0]
    document.getElementById('artist_meta').innerText =
      artistLists[typeof meta[1].artist !== 'undefined' ? meta[1].artist : 0]
    yohaneNoDOM.shokan()
  }
}

let yohane = {
  shokan: () => {
    if (!yohane.loaded) return 0
    yohaneNoDOM.shokan()
    yohane.play()
  },
  giran: () => {
    if (!yohane.loaded) return 0
    yohaneNoDOM.giran()
    yohane.pause()
  },

  volumeStore: null,
  loaded: false,

  setVolume: v => {
    yohane.volumeStore = v
    yohane.player().volume = v
  },

  player: () => {
    return document.getElementById('kara_audio')
  },

  fade: (from, to, duration, start, cb) => {
    if (audioVolumeFrame !== null) cancelAnimationFrame(audioVolumeFrame)
    audioVolumeFunction = () => {
      if (start + duration <= performance.now()) {
        cancelAnimationFrame(audioVolumeFrame)
        if (typeof cb === 'function') cb()
        return
      }
      audioVolumeFrame = requestAnimationFrame(audioVolumeFunction)

      var t = (start + duration - performance.now()) / duration

      if (from > to) {
        yohane.player().volume = from * t
      } else {
        yohane.player().volume = to * (1 - t)
      }
    }
    audioVolumeFunction()
  },

  toggle: () => yohane[yohane.player().paused ? 'play' : 'pause'](),
  stop: () => yohane.pause(true),
  playing: () => !yohane.player().paused,

  seekTo: zto => {
    if (yohane.playing()) yohane.pause(false, true)
    yohane.player().currentTime = yohane.player().duration * (zto / 100)
    yohane.play(true)
  },

  seekPrev: s =>
    (yohane.player().currentTime =
      yohane.player().currentTime - s < 0
        ? 0
        : yohane.player().currentTime - s),
  seekNext: s =>
    (yohane.player().currentTime =
      yohane.player().currentTime + s > yohane.player().duration
        ? (yohane.player().duration - yohane.player().currentTime) / 2
        : yohane.player().currentTime + s),
  volumeDown: s =>
    yohane.setVolume(
      yohane.player().volume - s < 0 ? 0 : yohane.player().volume - s
    ),
  volumeUp: s =>
    yohane.setVolume(
      yohane.player().volume + s > 1 ? 1 : yohane.player().volume + s
    ),

  play: force => {
    document.getElementById('pp_btn').innerHTML = 'pause'
    yohane.player().play()

    if (force) return 0
    yohane.fade(0, yohane.volumeStore, 600, performance.now(), () => {})
  },

  pause: (returnZero, force) => {
    document.getElementById('pp_btn').innerHTML = 'play_arrow'
    if (force) return yohane.player()[returnZero ? 'stop' : 'pause']()
    yohane.fade(yohane.player().volume, 0, 600, performance.now(), () => {
      yohane.player()[returnZero ? 'stop' : 'pause']()
    })
  },

  tick: () => {
    frameWorks = requestAnimationFrame(yohane.tick)
    if (typeof yohane.tickVal === 'undefined') yohane.tickVal = 0
    if (yohane.tickVal > 20) {
      yohane.tickVal = 0
      yohane.deferTick()
    }
    yohane.tickVal++

    if (yohane.player().paused) {
      cancelAnimationFrame(frameWorks)
    }
  },

  deferTick: () => {
    document.getElementById('played_time').innerHTML = timeString(
      yohane.player().currentTime
    )
    document.getElementById('left_time').innerHTML =
      '-' + timeString(yohane.player().duration - yohane.player().currentTime)

    document.getElementById('ctrl_time').value =
      (yohane.player().currentTime / yohane.player().duration) * 100
  },

  initialize: id => {
    try {
      yohane.player().src =
        (urlQueryParams('local') !== null
          ? './'
          : 'https://cdn.lovelivec.kr/') +
        'data/' +
        id +
        '/audio.mp3'
      yohane.setVolume(yohane.volumeStore !== null ? yohane.volumeStore : 0.5)
    } catch (e) {
      yohane.loaded = false
      return logger(2, 'r', e.message, 'e')
    }

    yohane.loaded = true
    yohaneNoDOM.initialize(id)
  },

  loadPlay: id => {
    yohane.initialize(id)
    yohane.play()
    yohaneNoDOM.dekekuni()
  }
}

let getFromLists = id => {
  var v = Object.keys(callLists)
  var sb = Number(id.toString().substring(3, 5)) - 1

  return [v[sb], callLists[v[sb]]]
}

const loadLyrics = id => {
  // urlQueryParams('id')
  $.ajax({
    url:
      (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      id +
      '/karaoke.json',
    success: function (data) {
      window.karaokeData = typeof data === 'object' ? data : JSON.parse(data)

      $('#title_text').html(karaokeData.metadata.title || '무제')
      $('#blade_color').html(karaokeData.metadata.bladeColorMember || '자유')
      document.title = karaokeData.metadata.title || '무제'

      var _hx = karaokeData.metadata.bladeColorHEX

      if (_hx !== null && _hx !== 'null' && _hx !== '#000000' && _hx !== '') {
        document.getElementById('blade_color').style.color = _hx
      }

      Karaoke.RenderDOM()
    },
    error: function (err) {
      return logger(2, 'r', err.message, 'e')
    }
  })

  window.addEventListener('KaraokeSelection', function (e) {
    document.getElementById('kara_audio').currentTime =
      karaokeData.timeline[e.detail.posX].collection[e.detail.posY].start_time /
        100 -
      0.03
  })
}

let pageAdjust = {
  lists: [],
  onePageItems: 12,
  currentPage: 0,
  remove: () => {},

  add: item => {
    if (pageAdjust.lists.length === 0) {
      pageAdjust.lists[0] = item
      return
    }

    for (var i = 0; i < pageAdjust.lists.length; i++) {
      if (typeof pageAdjust.lists[i] === 'undefined') {
        pageAdjust.lists[i] = []
        continue
      }
      if (pageAdjust.lists[i].length >= pageAdjust.onePageItems) {
        if (typeof pageAdjust.lists[i + 1] === 'undefined') {
          pageAdjust.lists[i + 1] = []
        }

        continue
      }

      pageAdjust.lists[i].push(item[0])
    }
  },

  render: pg => {
    $('#call_lists').html('')
    if (!pg) pg = 0
    for (var i = 0; i <= pageAdjust.lists[pg].length; i++) {
      $('#call_lists').append(pageAdjust.lists[pg][i])
    }
  }
}
const addElementToPage = () => {}

const ListsLoadDone = () => {
  var objKeys = Object.keys(callLists)
  pageAdjust.lists = []

  for (var i = 0; i < objKeys.length; i++) {
    var curObj = callLists[objKeys[i]]
    var baseElement = $(
      '<div class="card" onclick="yohane.loadPlay(' + curObj.id + ')"></div>'
    )

    baseElement.append(
      $(
        '<img id="' +
          curObj.id +
          '_bgimg" src="' +
          (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
          'data/' +
          curObj.id +
          '/bg.png"></img>'
      )
    )

    baseElement.append(
      $(
        '<h3 class="txt">' +
          (cookieYosoro.get('mikan') === 'true'
            ? curObj.translated || objKeys[i]
            : objKeys[i]) +
          '</h3>'
      )
    )

    pageAdjust.add(baseElement)
  }

  pageAdjust.render()
}

const resizeItemsCheck = () => {
  if (window.matchMedia('(min-width: 1501px)').matches) return 12
  if (window.matchMedia('(max-width: 1500px) and (min-width: 801px)').matches) {
    return 8
  }
  if (window.matchMedia('(max-width: 800px)').matches) return 4

  return 4
}

const keys = {
  32: [
    e => {
      yohane.toggle()
    },
    true
  ],
  37: [
    e => {
      yohane.seekPrev(5)
    },
    true
  ],
  38: [
    e => {
      yohane.volumeUp(0.05)
    },
    true
  ],
  39: [
    e => {
      yohane.seekNext(5)
    },
    true
  ],
  40: [
    e => {
      yohane.volumeDown(0.05)
    },
    true
  ]
}

const connectLiveActions = () => {
  var audio = document.getElementById('kara_audio')
  var context = new AudioContext()
  reverbjs.extend(context)

  var source = context.createMediaElementSource(audio)

  var reverbUrl = '/dome_SportsCentreUniversityOfYork.m4a'
  var reverbNode = context.createReverbFromUrl(reverbUrl, function () {
    reverbNode.connect(context.destination)
  })

  source.connect(reverbNode)
  audio.play()
}

$(document).ready(() => {
  // 인터넷 익스플로더 좀 쓰지 맙시다
  if (/* @cc_on!@ */ false || !!document.documentMode) {
    document.getElementById('PLEASE_STOP_USE_INTERNET_EXPLORER').style.display =
      'block'
  }

  yohane.player().onplay = () => {
    requestAnimationFrame(yohane.tick)
  }

  yohane.player().onpause = () => {
    cancelAnimationFrame(yohane.tick)
  }

  window.addEventListener('keydown', ev => {
    logger(2, 's', ev.key + ' / ' + ev.keyCode, 'info')
    if (typeof keys[ev.keyCode] === 'undefined') return 0
    keys[ev.keyCode][0](ev)
    if (keys[ev.keyCode][1]) ev.preventDefault()
  })

  $.ajax({
    url:
      (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
      'data/lists.json',
    success: d => {
      try {
        if (typeof d === 'string') callLists = d
      } catch (e) {
        logger(2, 'r', e.message, 'e')
      }

      callLists = d
      $('#loading_spin_ctlst').addClass('done')
      ListsLoadDone()
    },
    error: function (err) {
      logger(2, 'r', err.message, 'e')
    }
  })

  $('#genki_year').html(new Date().getFullYear())
  $('#genki_month').html(new Date().getMonth())
  $('#day_day').html(new Date().getDate())
  $('#day').html(
    ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
  )

  $(window).resize(() => {
    var reszCk = resizeItemsCheck()
    if (pageAdjust.onePageItems !== reszCk) {
      pageAdjust.onePageItems = reszCk
      ListsLoadDone()
    }
    pageAdjust.onePageItems = reszCk
  })
  pageAdjust.onePageItems = resizeItemsCheck()
})
