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
let callReqAnimation
let audioVolumeFunction = () => {}
const artistLists = ['Aqours', 'Saint Snow', 'Saint Aqours Snow']

const loadCallImage = id => {
  window.karaokeData = null
  $('#karaoke').html(
    '<div></div><h3>싱크 없음</h3><p>해당 악곡은 아직 싱크가 완성되지 않았습니다.</p>'
  )

  /* <img class="call_img" src="' +
      (urlQueryParams('local') !== 'true' ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      id +
      '/call.jpg' +
      '"></img> */
}

const loadLyrics = (id, obj) => {
  // urlQueryParams('id')
  $.ajax({
    url:
      (urlQueryParams('local') !== 'true' ? './' : '//cdn.lovelivec.kr/') +
      'data/' +
      id +
      '/karaoke.json',
    success: function (data) {
      window.karaokeData = typeof data === 'object' ? data : JSON.parse(data)

      $('#title_text').html(karaokeData.metadata.title || obj[0] || '무제')
      $('#blade_color').html(karaokeData.metadata.bladeColorMember || '자유')
      document.title =
        'LLCT > ' + (karaokeData.metadata.title || obj[0] || '무제')

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

  Sakurauchi.remove('KaraokeSelection')
  Sakurauchi.add('KaraokeSelection', e => {
    document.getElementById('kara_audio').currentTime =
      karaokeData.timeline[e.detail.posX].collection[e.detail.posY].start_time /
        100 -
      0.03
  })
}

let yohaneNoDOM = {
  kaizu: false,
  shokan: () => {
    $('.player').css('transition', 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)')
    $('.player').removeClass('hide')
    $('.player').addClass('show')

    if (yohaneNoDOM.kaizu) {
      yohaneNoDOM.dekakuni()
    }
  },

  giran: () => {
    $('.player').css(
      'transition',
      'all 0.5s cubic-bezier(0.95, 0.05, 0.795, 0.035)'
    )
    $('.player').removeClass('show')
    $('.player_bg').removeClass('show')
    $('.player').addClass('hide')

    if (yohaneNoDOM.kaizu) {
      yohaneNoDOM.chiisakuni()
    }
  },

  dekakuni: () => {
    $('.player_bg').addClass('show')
    $('.player').addClass('dekai')
    $('#dekaku_btn').removeClass('in_active')
    yohaneNoDOM.kaizu = true
  },

  chiisakuni: () => {
    $('.player_bg').removeClass('show')
    $('.player').removeClass('dekai')
    $('#dekaku_btn').addClass('in_active')
    yohaneNoDOM.kaizu = false
  },

  enableLiveEffects: () => {
    $('#live_btn').removeClass('in_active')
  },

  disableLiveEffects: () => {
    $('#live_btn').addClass('in_active')
  },

  initialize: id => {
    var meta = getFromLists(id)

    document.getElementById('album_meta').src =
      (urlQueryParams('local') !== 'true'
        ? './'
        : 'https://cdn.lovelivec.kr/') +
      '/data/' +
      id +
      '/bg.png'

    document.getElementById('title_meta').innerText = meta[0]
    document.getElementById('artist_meta').innerText =
      artistLists[meta[1].artist != null ? meta[1].artist : 0]
    yohaneNoDOM.shokan()

    if (meta[1].karaoke) {
      loadLyrics(id, meta)
    } else {
      loadCallImage(id)
    }
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
  audio_context:
    window.AudioContext || window.webkitAudioContext
      ? window.webkitAudioContext
        ? new webkitAudioContext()
        : new AudioContext()
      : null,
  volumeStore: null,
  liveEffectCry: false,
  liveEffectStore: false,
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

    var oncdPrevVolume = yohane.player().volume / 2
    audioVolumeFunction = force_stop => {
      if (
        start + duration <= performance.now() ||
        force_stop === true ||
        oncdPrevVolume === yohane.player().volume
      ) {
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
  timecode: () => yohane.player().currentTime * 100,

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

  audioSource: null,
  analyser: null,
  buffers: null,
  effectsArray: [],

  liveEffects: () => {
    if (yohane.audio_context === null) {
      return logger(2, 's', 'yohane.audio_context is not defined. TATEN', 'e')
    }
    if (yohane.liveEffectStore) {
      for (var i = 0; i < yohane.effectsArray.length; i++) {
        yohane.effectsArray[i].disconnect()
      }

      if (yohane.audioSource) {
        yohane.audioSource.connect(yohane.audio_context.destination)
      }

      yohane.liveEffectStore = false
      yohaneNoDOM.disableLiveEffects()
      return
    }

    if (!yohane.audioSource) {
      yohane.audioSource = yohane.audio_context.createMediaElementSource(
        yohane.player()
      )
    }

    if (!yohane.effectsArray[0]) {
      var highFilter = yohane.audio_context.createBiquadFilter()
      highFilter.type = 'highshelf'
      highFilter.frequency.value = 6000
      highFilter.gain.value = 5
      yohane.effectsArray.push(highFilter)
    }

    if (!yohane.effectsArray[1]) {
      reverbjs.extend(yohane.audio_context)
      var reverbNode = yohane.audio_context.createReverbFromUrl(
        '/Sochiru.wav',
        () => {
          reverbNode.connect(yohane.effectsArray[0])
        }
      )

      yohane.effectsArray.push(reverbNode)
    }

    if (!yohane.buffers) {
      yohane.analyser = yohane.audio_context.createAnalyser()
      yohane.analyser.fftSize = 2048
      yohane.buffers = new Float32Array(yohane.analyser.fftSize)
    }

    yohane.audioSource.connect(yohane.effectsArray[1])
    yohane.effectsArray[1].connect(yohane.analyser)
    yohane.analyser.connect(yohane.audio_context.destination)

    yohane.liveEffectStore = true
    yohaneNoDOM.enableLiveEffects()
    yohane.callEmitter()
  },

  volumeAvr: 1,
  waBall: 0,
  callEmitter: () => {
    if (
      !yohane.liveEffectStore ||
      yohane.player().paused ||
      typeof yohane.analyser['getFloatTimeDomainData'] === 'undefined'
    ) {
      if (callReqAnimation) cancelAnimationFrame(yohane.callEmitter)
      return
    }

    callReqAnimation = requestAnimationFrame(yohane.callEmitter)
    yohane.analyser.getFloatTimeDomainData(yohane.buffers)

    let sumOfSquares = 0
    for (let i = 0; i < yohane.buffers.length; i++) {
      sumOfSquares += yohane.buffers[i] ** 2
    }
    // var avgPowerDecibels = Math.log10(sumOfSquares / yohane.buffers.length) * 10

    yohane.volumeAvr =
      (yohane.volumeAvr + (sumOfSquares / yohane.buffers.length) * 10) / 2

    if (yohane.volumeAvr < 0.01 && yohane.waBall < 80 && yohane.liveEffectCry) {
      yohane.waBall++
    }

    if (yohane.waBall >= 80 && yohane.liveEffectCry) {
      const source = yohane.audio_context.createBufferSource()
      source.buffer = yohane.liveEffectCry
      source.connect(yohane.audio_context.destination)
      source.start()

      yohane.waBall = 0
    }
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
    if (yohane.tickVal == null) yohane.tickVal = 0
    if (yohane.tickVal > 20) {
      yohane.tickVal = 0
      yohane.deferTick()
    }
    yohane.tickVal++

    if (
      yohaneNoDOM.kaizu &&
      typeof karaokeData !== 'undefined' &&
      karaokeData !== null &&
      karaokeData.timeline
    ) {
      Karaoke.AudioSync(yohane.timecode())
    }

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
        (urlQueryParams('local') !== 'true'
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

    if (yohane.audio_context === null) {
      logger(
        2,
        'r',
        "AudioContext API isn't supported on this browser, disabling Live performance feature.",
        'w'
      )
    }

    if (!yohane.liveEffectCry) {
      window
        .fetch('/test.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => yohane.audio_context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          yohane.liveEffectCry = audioBuffer
        })
    }

    yohane.loaded = true
    yohaneNoDOM.initialize(id)
  },

  loadPlay: id => {
    yohane.initialize(id)
    yohane.play()
    yohaneNoDOM.dekakuni()
  }
}

const pagePlayerAnimation = (index, nextIndex, direction) => {
  yohane[nextIndex === 2 ? 'shokan' : 'giran']()
}

let getFromLists = id => {
  var v = Object.keys(callLists)
  var sb = Number(id.toString().substring(3, 5)) - 1

  return [v[sb], callLists[v[sb]]]
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

    window.lazyloadObj = new LazyLoad({
      elements_selector: '.lazy'
    })
  },

  setPage: s => {
    if (s >= pageAdjust.lists.length || s <= 0) {
      return 0
    }

    pageAdjust.currentPage = s
    pageAdjust.render(pageAdjust.currentPage)
  },

  nextPage: () => {
    return pageAdjust.setPage(pageAdjust.currentPage + 1)
  },

  prevPage: () => {
    return pageAdjust.setPage(pageAdjust.currentPage - 1)
  }
}

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
          '_bgimg" class="lazy" data-src="' +
          (urlQueryParams('local') !== 'true' ? './' : '//cdn.lovelivec.kr/') +
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

  pageAdjust.render(0)
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
  27: [
    e => {
      yohaneNoDOM.chiisakuni()
    },
    true
  ],
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

  Sakurauchi.listen(
    'onplay',
    () => requestAnimationFrame(yohane.tick),
    yohane.player()
  )
  Sakurauchi.listen(
    'onpause',
    () => cancelAnimationFrame(yohane.tick),
    yohane.player()
  )
  Sakurauchi.listen(
    ['seeking', 'seeked'],
    () => {
      Karaoke.clearSync(() => {
        Karaoke.AudioSync(Math.floor(yohane.timecode()), true)
      })
    },
    yohane.player()
  )

  window.addEventListener('keydown', ev => {
    logger(2, 's', ev.key + ' / ' + ev.keyCode, 'info')
    if (typeof keys[ev.keyCode] === 'undefined') return 0
    keys[ev.keyCode][0](ev)
    if (keys[ev.keyCode][1]) ev.preventDefault()
  })

  $.ajax({
    url:
      (urlQueryParams('local') !== 'true' ? './' : '//cdn.lovelivec.kr/') +
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

  Sakurauchi.listen('focus', () => {
    if (!yohane.playing()) return 0

    Karaoke.clearSync()
    Karaoke.AudioSync(yohane.timecode(), true)
  })

  Sakurauchi.listen('blur', () => {
    if (audioVolumeFunction !== null && audioVolumeFrame !== null) {
      audioVolumeFunction(true)
    }
  })

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
