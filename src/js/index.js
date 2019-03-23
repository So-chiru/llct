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
  document.getElementById('karaoke').innerHTML =
    '<img class="call_img" onclick="openCallImage(' +
    id +
    ')" src="' +
    (urlQueryParams('local') === 'true' ? './' : 'https://cdn.lovelivec.kr/') +
    'data/' +
    id +
    '/call.jpg' +
    '"></img>'
  yohaneNoDOM.shokan()
}

const openCallImage = id => {
  var pElement = document.getElementById('ps_wp')
  var items = [
    {
      src:
        (urlQueryParams('local') === 'true'
          ? './'
          : 'https://cdn.lovelivec.kr/') +
        'data/' +
        id +
        '/call.jpg',
      w: 3505,
      h: 2480
    }
  ]

  window.DCGall = new PhotoSwipe(pElement, PhotoSwipeUI_Default, items, {
    index: 0
  })
  window.DCGall.init()
  window.DCGall.listen('destroy', () => {
    popsHeart.set('pid', '')
  })
}

const loadLyrics = (id, obj) => {
  // urlQueryParams('id')
  $.ajax({
    url: './data/' + id + '/karaoke.json',
    success: function (data) {
      window.karaokeData = typeof data === 'object' ? data : JSON.parse(data)
      Karaoke.RenderDOM()
      yohaneNoDOM.shokan()
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

const changes = [
  {
    id: 'showAs_translated',
    data_key: 'mikan',
    checkbox: true,
    default: false,
    fn: _v => {
      setTimeout(() => {
        pageAdjust.buildPage()
      }, 100)
    }
  },
  {
    id: 'darkMode',
    data_key: 'yohane',
    checkbox: true,
    default: false,
    fn: v => {
      $('body')[v == 'true' || v == true ? 'addClass' : 'removeClass']('dark')
    }
  },
  {
    id: 'useInteractiveCall',
    data_key: 'interactiveCall',
    checkbox: true,
    default: true,
    fn: _v => {}
  },
  {
    id: 'doNotUseMusicPlayer',
    data_key: 'notUsingMP',
    checkbox: true,
    default: false,
    fn: v => {
      if (v === 'true' || v == true) {
        yohane.giran()
      }
    }
  },
  {
    id: 'useAlbumImage',
    data_key: 'sakana',
    checkbox: true,
    default: true,
    fn: v => {
      setTimeout(() => {
        pageAdjust.buildPage()
      }, 100)
    }
  },
  {
    id: 'useSetIntervalInstead',
    data_key: 'funeTiming',
    checkbox: true,
    default: false,
    fn: v => {
      frameWorks = null
      yohane.reInitTimingFunction()
      yohane.tick()
    }
  }
]

let changedOption = (i, v) => {
  changes[i].fn(v)
  dataYosoro.set(changes[i].data_key, v)
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

    popsHeart.set('pid', '')

    document.title = 'LLCT'
  },

  __cachedElement: {},

  end: () => {
    document.getElementById('pp_btn').innerHTML = 'play_arrow'
  },

  dekakuOnce: event => {
    if (!yohaneNoDOM.kaizu && window.matchMedia('(max-width: 800px)').matches) {
      yohaneNoDOM.dekakuni()
    }
  },

  toggleKaizu: () => {
    yohaneNoDOM.kaizu ? yohaneNoDOM.chiisakuni() : yohaneNoDOM.dekakuni()
  },

  dekakuni: () => {
    $('.player_bg').addClass('show')
    $('.player').addClass('dekai')
    $('#dekaku_btn').removeClass('in_active')
    yohaneNoDOM.kaizu = true
    $('body').css('overflow', 'hidden')
  },

  chiisakuni: () => {
    $('.player_bg').removeClass('show')
    $('.player').removeClass('dekai')
    $('#dekaku_btn').addClass('in_active')
    yohaneNoDOM.kaizu = false
    $('body').css('overflow', 'auto')
  },

  enableLiveEffects: () => {
    $('#live_btn').removeClass('in_active')
  },

  disableLiveEffects: () => {
    $('#live_btn').addClass('in_active')
  },

  play: () => {},
  pause: () => {},
  load: () => {},
  loadDone: () => {},
  loopToggle: () => {
    $('#repeat_btn')[yohane.__isRepeat ? 'removeClass' : 'addClass'](
      'in_active'
    )
  },

  showSetting: () => {
    $('.setting_layer').removeClass('hide')
    $('.setting_layer').addClass('show')
  },

  hideSetting: () => {
    $('.setting_layer').removeClass('show')
    $('.setting_layer').addClass('hide')
  },

  initialize: id => {
    if (popsHeart.get('pid') !== id.toString()) {
      popsHeart.set('pid', id)
    }

    if (dataYosoro.get('notUsingMP') == true) {
      return 0
    }

    ;['played_time', 'left_time', 'psd_times', '__current_thumb'].forEach(v => {
      yohaneNoDOM.__cachedElement[v] = document.getElementById(v)
    })

    if (yohaneNoDOM.kaizu) {
      yohaneNoDOM.chiisakuni()
    }
    yohaneNoDOM.load()

    document.getElementById('karaoke').innerHTML = ''
    var meta = getFromLists(id)

    if (dataYosoro.get('sakana') === true) {
      document.getElementById('album_meta').src =
        (urlQueryParams('local') === 'true'
          ? './'
          : 'https://cdn.lovelivec.kr/') +
        '/data/' +
        id +
        '/bg.png'
    } else {
      document.getElementById('album_meta').src = '/live_assets/1px.png'
      document.getElementById('album_meta').style.backgroundColor = '#323232'
    }

    document.getElementById('title_meta').innerText = meta[0]
    document.getElementById('artist_meta').innerText =
      artistLists[meta[1].artist != null ? meta[1].artist : 0]

    document.getElementById('blade_color').innerText =
      meta[1].blade_color || '자유'

    var _hx = meta[1].blade_color

    if (_hx !== null && _hx !== 'null' && _hx !== '#000000' && _hx !== '') {
      document.getElementById('blade_color').style.color = _hx
    }

    document.getElementById('sing_tg').innerText = meta[1].sa
      ? '이 곡은 따라 부르는 곡입니다.'
      : ''
    document.title = meta[1].kr || meta[0] || '제목 미 지정'

    if (meta[1].karaoke && dataYosoro.get('interactiveCall') != false) {
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

  shuffle: () => {
    var objK = Object.keys(callLists)
    yohane.loadPlay(callLists[objK[(Math.random() * objK.length) << 0]].id)
  },

  setVolume: v => {
    yohane.volumeStore = v
    yohane.player().volume = v
  },

  player: () => {
    return document.getElementById('kara_audio')
  },

  __isRepeat: false,
  repeatToggle: () => {
    yohane.__isRepeat = !yohane.__isRepeat
    yohaneNoDOM.loopToggle()
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
      highFilter.gain.value = 3
      yohane.effectsArray.push(highFilter)
    }

    if (!yohane.effectsArray[1]) {
      reverbjs.extend(yohane.audio_context)
      var reverbNode = yohane.audio_context.createReverbFromUrl(
        '/live_assets/HamiltonMausoleum.m4a',
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

  __useSetInterval: false,
  reInitTimingFunction: () => {
    yohane.__useSetInterval = dataYosoro.get('funeTiming') == true
  },
  tick: notAnimation => {
    if (!yohane.__useSetInterval) {
      frameWorks = requestAnimationFrame(yohane.tick)
    }

    if (yohane.__useSetInterval && frameWorks === null) {
      frameWorks = setInterval(() => {
        yohane.tick()
      }, 10)
    }
    if (yohane.tickVal == null) yohane.tickVal = 0
    if (yohane.tickVal > 15) {
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

    if (yohane.player().paused && !yohane.__useSetInterval) {
      cancelAnimationFrame(frameWorks)
    }
  },

  deferTick: () => {
    yohaneNoDOM.__cachedElement['played_time'].innerHTML = timeString(
      yohane.player().currentTime
    )
    yohaneNoDOM.__cachedElement['left_time'].innerHTML =
      '-' + timeString(yohane.player().duration - yohane.player().currentTime)

    yohaneNoDOM.__cachedElement['psd_times'].style.width =
      (yohane.player().currentTime / yohane.player().duration) * 100 + '%'

    yohaneNoDOM.__cachedElement['__current_thumb'].style.transform =
      'translateX(' +
      yohaneNoDOM.__cachedElement['psd_times'].clientWidth +
      'px)'
  },

  initialize: id => {
    yohaneNoDOM.initialize(id)
    if (dataYosoro.get('notUsingMP') == true) {
      openCallImage(id)
      return false
    }

    try {
      yohane.player().src =
        (urlQueryParams('local') === 'true'
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
        .fetch('/live_assets/crying_15.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => yohane.audio_context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          yohane.liveEffectCry = audioBuffer
        })
    }

    yohane.player().onpause = () => {
      yohaneNoDOM.pause()
    }

    yohane.loaded = true

    return true
  },

  loadPlay: id => {
    if (yohane.initialize(id)) {
      yohane.play()
      if (dataYosoro.get('doNotUseMusicPlayer') !== true) {
        yohaneNoDOM.dekakuni()
      }
    }
  }
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
  cListsElement: null,

  add: item => {
    if (pageAdjust.lists.length === 0) {
      pageAdjust.lists[0] = [item]
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

      pageAdjust.lists[i].push(item)
    }
  },

  render: pg => {
    if (pageAdjust.cListsElement === null) {
      pageAdjust.cListsElement = document.getElementById('call_lists')
    }
    pageAdjust.cListsElement.innerHTML = ''

    if (!pg) pg = 0

    var docFrag = document.createDocumentFragment()
    for (var i = 0, ls = pageAdjust.lists[pg].length; i <= ls; i++) {
      if (typeof pageAdjust.lists[pg][i] !== 'undefined') {
        docFrag.appendChild(pageAdjust.lists[pg][i])
        pageAdjust.lists[pg][i].className = pageAdjust.lists[pg][
          i
        ].className.replace(/\sshokan/g, '')
      }
    }
    pageAdjust.cListsElement.appendChild(docFrag)

    document.querySelectorAll('.card').forEach((v, i) => {
      setTimeout(() => {
        v.className += ' shokan slide-right'
      }, 25 * i)
    })

    window.lazyloadObj = new LazyLoad({
      elements_selector: '.lazy'
    })
    document.getElementById('totalPage').innerHTML = pageAdjust.lists.length
  },

  buildPage: () => {
    var objKeys = Object.keys(callLists)
    pageAdjust.lists = []

    for (var i = 0; i < objKeys.length; i++) {
      var curObj = callLists[objKeys[i]]
      var baseElement = document.createElement('div')
      baseElement.className = 'card'
      baseElement.setAttribute('onclick', 'yohane.loadPlay(' + curObj.id + ')')

      var c = document.createDocumentFragment()

      if (dataYosoro.get('sakana') === true) {
        var artImage = document.createElement('img')
        artImage.style = 'background-color: #323232;'
        artImage.id = curObj.id + '_bgimg'
        artImage.className = 'lazy card_bg'
        artImage.dataset.src =
          (urlQueryParams('local') === 'true'
            ? './'
            : 'https://cdn.lovelivec.kr/') +
          'data/' +
          curObj.id +
          '/bg.png'

        c.appendChild(artImage)
      } else {
        baseElement.style.backgroundColor = '#323232'
      }

      var titleText = document.createElement('h3')
      titleText.className = 'txt'
      titleText.innerText =
        dataYosoro.get('mikan') === true
          ? curObj.translated || objKeys[i]
          : objKeys[i]

      c.appendChild(titleText)
      baseElement.appendChild(c)

      pageAdjust.add(baseElement)
    }

    pageAdjust.setPage(0)
  },

  setPage: s => {
    if (s >= pageAdjust.lists.length || s < 0) {
      return 0
    }

    pageAdjust.currentPage = s
    pageAdjust.render(pageAdjust.currentPage)

    document.getElementById('currentPage').innerHTML =
      pageAdjust.currentPage + 1
  },

  nextPage: () => {
    return pageAdjust.setPage(pageAdjust.currentPage + 1)
  },

  prevPage: () => {
    return pageAdjust.setPage(pageAdjust.currentPage - 1)
  }
}

const resizeItemsCheck = () => {
  if (window.matchMedia('(min-width: 1501px)').matches) return 12
  if (window.matchMedia('(max-width: 1500px) and (min-width: 801px)').matches) {
    return 8
  }
  if (window.matchMedia('(max-width: 800px)').matches) return 6

  return 4
}

const keys = {
  27: [
    e => {
      yohaneNoDOM.chiisakuni()
    },
    false
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

  for (var i = 0; i < changes.length; i++) {
    var val = dataYosoro.get(changes[i].data_key)

    if (typeof val === 'undefined' || val == null) {
      dataYosoro.set(changes[i].data_key, changes[i].default)
      val = changes[i].default
    }

    document.getElementById(changes[i].id)[
      changes[i].checkbox ? 'checked' : 'value'
    ] = changes[i].checkbox ? val == 'true' || val == true : val
    changes[i].fn(val)
  }

  yohane.player().onplay = () => {
    if (!yohane.__useSetInterval) {
      requestAnimationFrame(yohane.tick)

      return
    }

    frameWorks = setInterval(() => {
      yohane.tick()
    }, 10)
  }

  yohane.player().onended = () => {
    if (yohane.__isRepeat) {
      yohane.seekTo(0)
      yohane.play()

      return
    }

    yohaneNoDOM.end()
  }

  yohane.player().onpause = () => {
    if (!yohane.__useSetInterval) {
      cancelAnimationFrame(yohane.tick)

      return
    }

    if (frameWorks) clearInterval(frameWorks)
  }

  Sakurauchi.listen(
    ['seeking', 'seeked'],
    () => {
      Karaoke.clearSync(() => {
        Karaoke.AudioSync(Math.floor(yohane.timecode()), true)
      })
    },
    yohane.player()
  )

  Sakurauchi.listen('keydown', ev => {
    logger(2, 's', ev.key + ' / ' + ev.keyCode, 'info')
    if (typeof keys[ev.keyCode] === 'undefined') return 0
    keys[ev.keyCode][0](ev)
    if (keys[ev.keyCode][1]) ev.preventDefault()
  })

  window.selectorHammer = new Hammer(document.getElementById('fp_ct'))
  selectorHammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
  selectorHammer.on('swipe', ev => {
    pageAdjust[ev.direction === 2 ? 'nextPage' : 'prevPage']()
  })

  window.playerHammer = new Hammer(document.getElementById('dash_wrp_ham'))
  playerHammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL })
  playerHammer.get('pinch').set({ enable: true })
  playerHammer.on('swipe', ev => {
    if (ev.direction === 16) {
      yohaneNoDOM.kaizu ? yohaneNoDOM.chiisakuni() : yohane.giran()
    } else if (ev.direction === 8) {
      yohaneNoDOM.dekakuni()
    }
  })

  $.ajax({
    url: './data/lists.json',
    success: d => {
      try {
        if (typeof d === 'string') callLists = d
      } catch (e) {
        logger(2, 'r', e.message, 'e')
      }

      callLists = d
      $('#loading_spin_ctlst').addClass('done')
      pageAdjust.buildPage()

      if (
        popsHeart.get('pid') !== null &&
        popsHeart.get('pid') !== '' &&
        !isNaN(popsHeart.get('pid'))
      ) {
        yohane.initialize(popsHeart.get('pid'))

        if (!dataYosoro.get('doNotUseMusicPlayer')) {
          yohaneNoDOM.dekakuni()
        }
      }
    },
    error: function (err) {
      logger(2, 'r', err.message, 'e')
    }
  })

  document.getElementById('genki_year').innerText = new Date().getFullYear()
  document.getElementById('zenkai_month').innerText = new Date().getMonth() + 1
  document.getElementById('day_day').innerText = new Date().getDate()
  document.getElementById('day').innerText = [
    '일',
    '월',
    '화',
    '수',
    '목',
    '금',
    '토'
  ][new Date().getDay()]

  Sakurauchi.listen(
    'click',
    () => {
      yohaneNoDOM.toggleKaizu()
    },
    document.getElementById('dekaku_btn')
  )

  Sakurauchi.listen(
    'click',
    ev => {
      var vp = document
        .getElementById('bar_eventListen')
        .getBoundingClientRect()

      yohane.seekTo(((ev.clientX - vp.left) / vp.width) * 100)
    },
    document.getElementById('bar_eventListen')
  )

  Sakurauchi.listen(
    'touchstart',
    () => {
      document.getElementById('kara_player').className += ' hover'
    },
    document.getElementById('kara_player'),
    { passive: true }
  )

  Sakurauchi.listen(
    'touchend',
    () => {
      document.getElementById('kara_player').classList.remove('hover')
    },
    document.getElementById('kara_player')
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
      pageAdjust.buildPage()
    }
    pageAdjust.onePageItems = reszCk
  })
  pageAdjust.onePageItems = resizeItemsCheck()
  $('#curt').addClass('hide_curtain')
})
