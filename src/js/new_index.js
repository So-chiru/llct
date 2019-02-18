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

let frameWorks
let audioVolumeFrame = null
let audioVolumeFunction = () => {}

let yohane = {
  shokan: () => {
    $('.player').css('transition', 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)')
    $('.player').removeClass('hide')
    $('.player').addClass('show')
    yohane.play()
  },
  giran: () => {
    $('.player').css(
      'transition',
      'all 0.5s cubic-bezier(0.95, 0.05, 0.795, 0.035)'
    )
    $('.player').removeClass('show')
    $('.player').addClass('hide')
    yohane.pause()
  },

  volumeStore: 0.5,

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

  play: () => {
    yohane.player().play()
    yohane.fade(0, yohane.volumeStore, 1000, performance.now(), () => {})
  },

  pause: () => {
    yohane.fade(yohane.player().volume, 0, 1000, performance.now(), () => {
      yohane.player().pause()
    })
  },

  tick: () => {
    frameWorks = requestAnimationFrame(yohane.tick)
    if (typeof yohane.tickVal === 'undefined') yohane.tickVal = 0
    if (yohane.tickVal > 50) {
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
    let audpl = yohane.player()

    audpl.src =
      (urlQueryParams('local') !== null ? './' : 'https://cdn.lovelivec.kr/') +
      'data/' +
      id +
      '/audio.mp3'
    audpl.volume = 0.5

    document.getElementById('album_meta').src =
      (urlQueryParams('local') !== null ? './' : 'https://cdn.lovelivec.kr/') +
      '/data/' +
      id +
      '/bg.png'
  }
}

$(document).ready(() => {
  yohane.initialize(10083)

  yohane.player().onplay = () => {
    requestAnimationFrame(yohane.tick)
  }

  yohane.player().onpause = () => {
    cancelAnimationFrame(yohane.tick)
  }

  $.ajax({
    url:
      (urlQueryParams('local') !== null ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      urlQueryParams('id') +
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
})
