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
let callReqAnimation
let audioVolumeFunction = () => {}
const artistLists = [
  'Aqours',
  'Saint Snow',
  'Saint Aqours Snow',
  '2학년 - 타카미 치카, 와타나베 요우, 사쿠라우치 리코',
  '1학년 - 쿠로사와 루비, 쿠니키다 하나마루, 츠시마 요시코',
  '3학년 - 쿠로사와 다이아, 마츠우라 카난, 오하라 마리',
  'CYaRon!',
  'AZALEA',
  'Guilty Kiss',
  '와타나베 요우 (CV. 사이토 슈카), 츠시마 요시코 (CV. 코바야시 아이카)',
  '타카미 치카 (CV. 이나미 안쥬), 마츠우라 카난 (CV. 스와 나나카)',
  '쿠로사와 루비 (CV. 후리하타 아이), 쿠로사와 다이아 (CV. 코미야 아리사)',
  '타카미 치카 (CV. 이나미 안쥬)',
  '와타나베 요우 (CV. 사이토 슈카)',
  '사쿠라우치 리코 (CV. 아이다 리카코)',
  '쿠로사와 루비 (CV. 후리하타 아이)',
  '쿠니키다 하나마루 (CV. 타카츠키 카나코)',
  '츠시마 요시코 (CV. 코바야시 아이카)',
  '쿠로사와 다이아 (CV. 코미야 아리사)',
  '마츠우라 카난 (CV. 스와 나나카)',
  '오하라 마리 (CV. 스즈키 아이나)'
]

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
    yohaneNoDOM.timeLeapDisableAnimation()
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
      document
        .getElementsByTagName('body')[0]
        .classList[v == 'true' || v == true ? 'add' : 'remove']('dark')
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
    id: 'useOfflineSaving',
    data_key: 'offlineShip',
    checkbox: true,
    default: false,
    fn: v => {
      if ('serviceWorker' in navigator) {
        if (!v) {
          navigator.serviceWorker
            .getRegistrations()
            .then(r => {
              for (let _rs of r) {
                _rs.unregister()
              }
            })
            .catch(e =>
              logger(2, 's', 'Failed to get ServiceWorker. ' + e.message, 'e')
            )

          return
        }

        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then(_regi => {
            logger(2, 's', 'ServiceWorker registered. Yosoro~', 'i')

            _regi.addEventListener('updatefound', () => {
              var nw_ins = _regi.installing

              nw_ins.addEventListener('statechange', () => {
                if (nw_ins.state !== 'installed') return 0
                if (navigator.serviceWorker.controller) {
                  _glb_ShowPopup()
                  document.getElementById('__off_txt').className = 'hide'
                  document.getElementById('__new_ver').className = 'show'
                }
              })
            })
          })
          .catch(e =>
            logger(
              2,
              's',
              'Failed to register ServiceWorker. ' + e.message,
              'e'
            )
          )

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          location.reload()
        })
      }
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

let LLCT = {
  __pkg_callLists: [],
  __cur_filterLists: [],
  showSetting: () => {
    document.getElementsByClassName('setting_layer')[0].classList.remove('hide')
    document.getElementsByClassName('setting_layer')[0].classList.add('show')
  },

  hideSetting: () => {
    document.getElementsByClassName('setting_layer')[0].classList.remove('show')
    document.getElementsByClassName('setting_layer')[0].classList.add('hide')
  },

  jumpToPageDialog: () => {
    var __askd_result = prompt(
      '이동 할 페이지를 입력 해 주세요. ( ' +
        (pageAdjust.currentPage + 1) +
        ' / ' +
        pageAdjust.lists.length +
        ' )',
      pageAdjust.currentPage
    )
    if (typeof __askd_result === 'undefined' || isNaN(__askd_result)) return 0
    pageAdjust.setPage(Number(__askd_result) - 1)
  },

  setTitleTo: t => {
    document.getElementById('p_title').innerHTML = t
  },

  currentPage: 0,

  viewPlayLists: () => {
    LLCT.currentPage = 1
    LLCT.setTitleTo('재생 목록')
    document.getElementById('pl_ms_switcher').innerHTML =
      '<span class="material-icons ti">library_music</span>'
  },

  viewMusicLists: () => {
    LLCT.currentPage = 0
    LLCT.setTitleTo('노래 목록')
    document.getElementById('pl_ms_switcher').innerHTML =
      '<span class="material-icons ti">queue_music</span>'
  },

  openPlayList: id => {}
}

let yohaneNoDOM = {
  kaizu: false,
  shokan: () => {
    var playerElement = document.getElementsByClassName('player')[0]
    playerElement.style.transition = 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
    playerElement.classList.remove('hide')
    playerElement.classList.add('show')

    if (yohaneNoDOM.kaizu) {
      yohaneNoDOM.dekakuni()
    }
  },

  giran: () => {
    var playerElement = document.getElementsByClassName('player')[0]
    playerElement.style.transition =
      'all 0.5s cubic-bezier(0.95, 0.05, 0.795, 0.035)'
    playerElement.classList.remove('show')
    document.getElementsByClassName('player')[0].classList.remove('show')
    playerElement.classList.add('hide')

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

  registerBufferBar: () => {
    yohaneNoDOM.__cachedElement['bar_eventListen'].classList.add('__buf')

    Sakurauchi.listen(
      'canplaythrough',
      () => {
        yohaneNoDOM.__cachedElement['bar_eventListen'].classList.remove('__buf')
      },
      yohane.player()
    )
  },

  timeLeapDisableAnimation: () => {
    document
      .getElementsByClassName('thumb')[0]
      .classList.add('disable_animation')
    document
      .getElementsByClassName('passed_bar')[0]
      .classList.add('disable_animation')

    setTimeout(() => {
      document
        .getElementsByClassName('thumb')[0]
        .classList.remove('disable_animation')
      document
        .getElementsByClassName('passed_bar')[0]
        .classList.remove('disable_animation')
    }, 200)
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
    document.getElementsByClassName('player_bg')[0].classList.add('show')
    document.getElementsByClassName('player')[0].classList.add('dekai')
    document.getElementById('dekaku_btn').classList.remove('in_active')
    yohaneNoDOM.kaizu = true
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  },

  chiisakuni: () => {
    document.getElementsByClassName('player_bg')[0].classList.remove('show')
    document.getElementsByClassName('player')[0].classList.remove('dekai')
    document.getElementById('dekaku_btn').classList.add('in_active')
    yohaneNoDOM.kaizu = false
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  },

  enableLiveEffects: () => {
    document.getElementById('in_active').classList.remove('in_active')
  },

  disableLiveEffects: () => {
    document.getElementById('in_active').classList.add('in_active')
  },

  play: () => {},
  pause: () => {},
  load: () => {},
  loadDone: () => {},
  loopToggle: () => {
    if (yohane.__isRepeat) {
      document.getElementById('pl_loop').innerHTML = 'loop'
    }

    document
      .getElementById('pl_loop')
      .classList[yohane.__isShuffle || yohane.__isRepeat ? 'remove' : 'add'](
        'in_active'
      )
  },

  playingNextToggle: () => {
    if (yohane.__isShuffle) {
      document.getElementById('pl_loop').innerHTML = 'shuffle'
    }
    document
      .getElementById('pl_loop')
      .classList[yohane.__isShuffle || yohane.__isRepeat ? 'remove' : 'add'](
        'in_active'
      )
  },

  noLoopIcon: () => {
    document.getElementById('pl_loop').innerHTML = 'loop'
    document.getElementById('pl_loop').classList.add('in_active')
  },

  initialize: id => {
    if (popsHeart.get('pid') !== id.toString()) {
      popsHeart.set('pid', id)
    }

    if (dataYosoro.get('notUsingMP') == true) {
      return 0
    }

    ;[
      'played_time',
      'left_time',
      'bar_eventListen',
      'psd_times',
      '__current_thumb'
    ].forEach(v => {
      yohaneNoDOM.__cachedElement[v] = document.getElementById(v)
    })

    yohaneNoDOM.__cachedElement['psd_times'].style.width = '0px'
    yohaneNoDOM.__cachedElement['__current_thumb'].style.transform = 0

    yohaneNoDOM.load()
    yohaneNoDOM.registerBufferBar()

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

    document.getElementById('title_meta').innerText =
      dataYosoro.get('mikan') === true ? meta[1].translated || meta[0] : meta[0]
    document.getElementById('artist_meta').innerText =
      artistLists[meta[1].artist != null ? meta[1].artist : 0]

    document.getElementById('blade_color').innerText =
      meta[1].bladeColor || '자유'

    var _hx = meta[1].bladeColorHEX

    if (_hx !== null && _hx !== 'null' && _hx !== '#000000' && _hx !== '') {
      document.getElementById('blade_color').style.color = _hx
    }

    document.getElementById('sing_tg').style.display = meta[1].singAlong
      ? 'block'
      : 'none'
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

  shuffle: skipDekaku => {
    var objK = Object.keys(LLCT.__cur_filterLists)
    yohane.loadPlay(
      LLCT.__cur_filterLists[objK[(Math.random() * objK.length) << 0]].id,
      skipDekaku
    )
  },

  setVolume: v => {
    yohane.volumeStore = v
    yohane.player().volume = v
  },

  player: () => {
    return document.getElementById('kara_audio')
  },

  __isRepeat: false,
  __isShuffle: false,
  repeatToggle: () => {
    yohane.__isRepeat = !yohane.__isRepeat
    yohaneNoDOM.loopToggle()
  },

  playNextToggle: () => {
    yohane.__isShuffle = !yohane.__isShuffle
    yohaneNoDOM.playingNextToggle()
  },

  toggleLoops: () => {
    if (!yohane.__isRepeat && !yohane.__isShuffle) {
      yohane.repeatToggle()
      return
    }

    if (yohane.__isRepeat && !yohane.__isShuffle) {
      yohane.repeatToggle()
      yohane.playNextToggle()
      return
    }

    if (!yohane.__isRepeat && yohane.__isShuffle) {
      yohane.playNextToggle()
      yohaneNoDOM.noLoopIcon()
    }
  },

  fade: (from, to, duration, start, cb) => {
    if (audioVolumeFrame !== null) cancelAnimationFrame(audioVolumeFrame)

    var oncdPrevVolume = yohane.player().volume / 2
    audioVolumeFunction = force_stop => {
      if (
        start + duration <= performance.now() ||
        force_stop === true ||
        oncdPrevVolume === yohane.player().volume ||
        document.hidden
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
    yohaneNoDOM.timeLeapDisableAnimation()
  },

  seekPrev: s => {
    yohane.player().currentTime =
      yohane.player().currentTime - s < 0 ? 0 : yohane.player().currentTime - s
    yohaneNoDOM.timeLeapDisableAnimation()
  },
  seekNext: s => {
    yohane.player().currentTime =
      yohane.player().currentTime + s > yohane.player().duration
        ? (yohane.player().duration - yohane.player().currentTime) / 2
        : yohane.player().currentTime + s
    yohaneNoDOM.timeLeapDisableAnimation()
  },
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

    yohane.audioSource.crossOrigin = 'anonymous'

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
  tick: _ => {
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
    var calc_t = yohane.player().currentTime / yohane.player().duration
    yohaneNoDOM.__cachedElement['played_time'].innerHTML = timeString(
      yohane.player().currentTime
    )
    yohaneNoDOM.__cachedElement['left_time'].innerHTML =
      '-' + timeString(yohane.player().duration - yohane.player().currentTime)

    yohaneNoDOM.__cachedElement['psd_times'].style.width = calc_t * 100 + '%'

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

    yohane.player().onpause = () => {
      yohaneNoDOM.pause()
    }

    yohane.loaded = true

    return true
  },

  loadPlay: (id, skipDekaku) => {
    if (yohane.initialize(id)) {
      yohane.play()

      if (dataYosoro.get('doNotUseMusicPlayer') !== true && !skipDekaku) {
        yohaneNoDOM.dekakuni()
      }
    }
  }
}

let getFromLists = id => {
  var v = Object.keys(LLCT.__pkg_callLists)
  var sb = Number(id.toString().substring(3, 5)) - 1

  return [v[sb], LLCT.__pkg_callLists[v[sb]]]
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
      pageAdjust.cListsElement = document.getElementById('_card_lists')
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
    var objKeys = Object.keys(LLCT.__cur_filterLists)
    pageAdjust.lists = []

    for (var i = 0; i < objKeys.length; i++) {
      var curObj = LLCT.__cur_filterLists[objKeys[i]]
      var baseElement = document.createElement('div')
      baseElement.className = 'card'
      baseElement.setAttribute('onclick', 'yohane.loadPlay(' + curObj.id + ')')

      var c = document.createDocumentFragment()

      if (dataYosoro.get('sakana') === true) {
        var artImage = document.createElement('img')
        artImage.style = 'background-color: #323232;'
        artImage.id = curObj.id + '_bgimg'
        artImage.alt = objKeys[i]
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

let pageLoadedFunctions = () => {
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

    if (yohane.__isShuffle) {
      yohane.shuffle(!yohane.kaizu)
    }
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
      Karaoke.tickSoundsCache = {}
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

  var __lcal_loadedAjax = d => {
    LLCT.__pkg_callLists = d
    LLCT.__cur_filterLists = d

    document.getElementById('loading_spin_ctlst').classList.add('done')
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
  }

  if (typeof $ !== 'undefined') {
    $.ajax({
      url: './data/lists.json',
      success: __lcal_loadedAjax,
      error: function (err) {
        logger(2, 'r', err.message, 'e')
      }
    })
  } else {
    fetch('./data/lists.json').then(res => {
      __lcal_loadedAjax(res.json())
    })
  }

  if (!window.navigator.onLine) _glb_ShowPopup()

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

  Sakurauchi.add('tickSounds', () => {
    document.getElementById('tick_sounds').currentTime = 0
    document.getElementById('tick_sounds').play()
  })

  Sakurauchi.add('tickSoundChanged', v => {
    document
      .getElementById('tick_btn')
      .classList[v ? 'remove' : 'add']('in_active')

    dataYosoro.set('biTick', v)
  })

  Karaoke.tickSoundEnable =
    dataYosoro.get('biTick') == null ||
    typeof dataYosoro.get('biTick') === 'undefined'
      ? true
      : !!dataYosoro.get('biTick')

  Sakurauchi.run('tickSoundChanged', Karaoke.tickSoundEnable)

  Sakurauchi.listen(
    'click',
    ev => {
      var vp = document
        .getElementById('bar_eventListen')
        .getBoundingClientRect()

      yohane.seekTo(((ev.clientX - vp.left) / vp.width) * 100)
    },
    document.getElementById('ctrl_times')
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

  if (typeof $ !== 'undefined') {
    $(window).resize(resizeFunctions)
  } else {
    Sakurauchi.listen('onresize', resizeFunctions)
  }

  pageAdjust.onePageItems = resizeItemsCheck()
  document.getElementById('curt').classList.add('hide_curtain')
}

if (typeof $ !== 'undefined') {
  $(document).ready(pageLoadedFunctions)
} else {
  Sakurauchi.listen('DOMContentLoaded', pageLoadedFunctions)
}

let resizeFunctions = () => {
  var reszCk = resizeItemsCheck()
  if (pageAdjust.onePageItems !== reszCk) {
    pageAdjust.onePageItems = reszCk
    pageAdjust.buildPage()
  }
  pageAdjust.onePageItems = reszCk
}
