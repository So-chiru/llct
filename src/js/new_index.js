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
  }
}

let getFromLists = id => {
  var v = Object.keys(callLists)
  var sb = id.toString().substring(3, 4)

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
      console.error(err)
    }
  })

  window.addEventListener('KaraokeSelection', function (e) {
    document.getElementById('kara_audio').currentTime =
      karaokeData.timeline[e.detail.posX].collection[e.detail.posY].start_time /
        100 -
      0.03
  })
}

$(document).ready(() => {
  yohane.player().onplay = () => {
    requestAnimationFrame(yohane.tick)
  }

  yohane.player().onpause = () => {
    cancelAnimationFrame(yohane.tick)
  }

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
    },
    error: function (err) {
      console.error(err)
    }
  })
})
