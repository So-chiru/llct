const timeString = sec => {
  sec = Math.floor(sec)
  return (
    (sec >= 60 ? Math.floor(sec / 60) : '0') +
    ' : ' +
    (sec % 60 < 10 ? '0' : '') +
    (sec % 60)
  )
}

let requestAudioSync
let requestAudioVolume = null

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

  clearCache: () => {
    navigator.serviceWorker.controller.postMessage({ cmd: '_clrs' })
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

  openPlayList: id => {},

  openCallImage: id => {
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
        w: id === 'krtf' ? 1652 : 3505,
        h: id === 'krtf' ? 1680 : 2480
      }
    ]

    window.DCGall = new PhotoSwipe(pElement, PhotoSwipeUI_Default, items, {
      index: 0
    })
    window.DCGall.init()
    window.DCGall.listen('destroy', () => {
      popsHeart.set('pid', '')
    })
  },

  loadCallImage: id => {
    document.getElementById('karaoke').innerHTML =
      `<img class="call_img" onclick="LLCT.openCallImage('${id}')" src="` +
      (urlQueryParams('local') === 'true'
        ? './'
        : 'https://cdn.lovelivec.kr/') +
      'data/' +
      id +
      '/call.jpg' +
      '"></img>'
    yohaneNoDOM.shokan()
  },

  loadLyrics: id => {
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
        karaokeData.timeline[e.detail.posX].collection[e.detail.posY]
          .start_time /
          100 -
        0.03
      yohaneNoDOM.timeLeapDisableAnimation()
    })
  },

  getFromLists: id => {
    var v = Object.keys(LLCT.__pkg_callLists)
    for (var i = 0; i < v.length; i++) {
      var vi = v[i]
      if (LLCT.__pkg_callLists[vi].id != id) continue

      return [vi, LLCT.__pkg_callLists[vi]]
    }
  }
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

  end: () => yohaneNoDOM.pause(),

  registerBufferBar: () => {
    yohaneNoDOM.__cachedElement['bar_eventListen'].classList.add('__buf')

    Sakurauchi.listen(
      'canplaythrough',
      () => {
        if (typeof gtag !== 'undefined' && window.performance) {
          gtag('event', 'timing_complete', {
            name: 'Audio load time',
            value: Math.round(
              (window.performance ? performance.now() : Date.now()) -
                LLCT.audioLoadStarted
            ),
            event_category: 'Audio'
          })
        }
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

  play: () => {
    anime({
      targets: '#pp_btn',
      rotate: 60,
      opacity: 0,
      delay: 0,
      duration: 300,
      easing: 'easeInExpo',
      begin: a => {},
      complete: a => {
        document.getElementById('pp_btn').innerHTML = 'pause'
        yohaneNoDOM.play_seqT()
      }
    })
  },
  play_seqT: () => {
    anime({
      targets: '#pp_btn',
      rotate: 360,
      opacity: 1,
      delay: 0,
      duration: 400,
      easing: 'easeOutExpo',
      begin: a => {
        a.seek(0.3)
      },
      complete: a => {
        document.getElementById('pp_btn').style.transform = 'rotate(0deg);'
      }
    })
  },
  __pzAnime: null,
  pause: () => {
    if (yohaneNoDOM.__pzAnime != null) return 0
    yohaneNoDOM.__pzAnime = anime({
      targets: '#pp_btn',
      rotate: -60,
      opacity: 0,
      delay: 0,
      duration: 300,
      easing: 'easeInExpo',
      begin: a => {},
      complete: a => {
        document.getElementById('pp_btn').innerHTML = 'play_arrow'
        yohaneNoDOM.pause_seqT()
      }
    })
  },
  pause_seqT: () => {
    yohaneNoDOM.__pzAnime = anime({
      targets: '#pp_btn',
      rotate: 360,
      opacity: 1,
      delay: 0,
      duration: 400,
      easing: 'easeOutExpo',
      begin: a => {
        a.seek(0.3)
      },
      complete: a => {
        yohaneNoDOM.__pzAnime = null
        document.getElementById('pp_btn').style.transform = 'rotate(0deg);'
      }
    })
  },
  tickIcon: v => {
    var is_dark = /dark/.test(
      document.getElementsByTagName('body')[0].className
    )
    anime({
      targets: '#tick_btn',
      keyframes: [
        { translateX: 2, rotate: '-10deg' },
        { translateX: -2, rotate: '10deg' },
        { translateX: 2, rotate: '-10deg' },
        { translateX: -2, rotate: '10deg' },
        { translateX: 0, rotate: '0deg' }
      ],
      color: v
        ? is_dark
          ? '#ddd'
          : '#737373'
        : is_dark
          ? '#6b6b6b'
          : '#c4c4c4',
      delay: 0,
      duration: 300,
      easing: 'easeOutExpo'
    })
  },
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

    LLCT.audioLoadStarted = window.performance ? performance.now() : Date.now()
    if (typeof gtag !== 'undefined') {
      gtag('event', 'play', {
        event_category: 'Audio',
        event_label: 'music id ' + id
      })
    }

    document.getElementById('_of_ric').style.display = window.navigator.onLine
      ? 'none'
      : 'block'

    if (dataYosoro.get('notUsingMP')) return 0
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
    var meta = LLCT.getFromLists(id)

    if (dataYosoro.get('sakana') === true) {
      document.getElementById('album_meta').src =
        (urlQueryParams('local') === 'true'
          ? './'
          : 'https://cdn.lovelivec.kr/') +
        'data/' +
        id +
        '/bg.png'
    } else {
      document.getElementById('album_meta').src = '/live_assets/1px.png'
      document.getElementById(
        'album_meta'
      ).style.backgroundColor = dataYosoro.get('yohane') ? '#323232' : '#D0D0D0'
    }

    var artistText = artistLists[meta[1].artist != null ? meta[1].artist : 0]
    document.getElementById('title_meta').innerText =
      dataYosoro.get('mikan') === true ? meta[1].translated || meta[0] : meta[0]
    document.getElementById('artist_meta').innerText = artistText
    document.getElementById('artist_meta').title = artistText

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

    LLCT[
      meta[1].karaoke && dataYosoro.get('interactiveCall') != false
        ? 'loadLyrics'
        : 'loadCallImage'
    ](id)
  }
}

let yohane = {
  shokan: () => {
    yohaneNoDOM.shokan()
    yohane.play()
  },
  giran: () => {
    yohaneNoDOM.giran()
    yohane.pause()
  },
  volumeStore: null,
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
      anime({
        targets: '#pl_loop',
        rotate: '-360deg',
        delay: 0,
        duration: 600,
        easing: 'easeOutExpo',
        complete: a => {
          document.getElementById('pl_loop').style.transform = ''
        }
      })

      yohane.repeatToggle()
      return
    }

    if (yohane.__isRepeat && !yohane.__isShuffle) {
      yohane.repeatToggle()
      yohane.playNextToggle()

      anime({
        targets: '#pl_loop',
        rotate: '360deg',
        delay: 0,
        duration: 600,
        easing: 'easeOutExpo',
        complete: a => {
          document.getElementById('pl_loop').style.transform = ''
        }
      })
      return
    }

    if (!yohane.__isRepeat && yohane.__isShuffle) {
      yohane.playNextToggle()
      yohaneNoDOM.noLoopIcon()

      anime({
        targets: '#pl_loop',
        rotate: '0deg',
        delay: 0,
        duration: 600,
        easing: 'easeOutExpo'
      })
    }
  },

  __vAnimeFunc: () => {},
  fade: (from, to, duration, start, cb) => {
    if (requestAudioVolume !== null) cancelAnimationFrame(requestAudioVolume)

    var oncdPrevVolume = yohane.player().volume / 2
    yohane.__vAnimeFunc = force_stop => {
      if (
        start + duration <= performance.now() ||
        force_stop === true ||
        oncdPrevVolume === yohane.player().volume ||
        document.hidden
      ) {
        cancelAnimationFrame(requestAudioVolume)
        if (typeof cb === 'function') cb()
        return
      }
      requestAudioVolume = requestAnimationFrame(yohane.__vAnimeFunc)

      var t = (start + duration - performance.now()) / duration

      if (from > to) {
        yohane.player().volume = from * t
      } else {
        yohane.player().volume = to * (1 - t)
      }
    }
    yohane.__vAnimeFunc()
  },

  toggle: () => {
    yohane[yohane.player().paused ? 'play' : 'pause']()
  },
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

  play: force => {
    yohane.player().play()

    if (force) return 0
    yohane.fade(0, yohane.volumeStore, 600, performance.now(), () => {})
  },

  pause: (returnZero, force) => {
    yohaneNoDOM.pause()

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
      requestAudioSync = requestAnimationFrame(yohane.tick)
    }

    if (yohane.__useSetInterval && requestAudioSync === null) {
      requestAudioSync = setInterval(() => {
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
      cancelAnimationFrame(requestAudioSync)
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
    window.karaokeData = null
    yohaneNoDOM.initialize(id)

    if (dataYosoro.get('notUsingMP')) {
      LLCT.openCallImage(id)
      return false
    }

    var _play_cnts = JSON.parse(dataYosoro.get('playedTimes') || '{}')
    _play_cnts[id] = typeof _play_cnts[id] !== 'number' ? 0 : _play_cnts[id] + 1
    dataYosoro.set('playedTimes', JSON.stringify(_play_cnts))

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
      return logger(2, 'r', e.message, 'e')
    }

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
        var pgI = pageAdjust.lists[pg][i]
        docFrag.appendChild(pgI)

        pgI.style.animationDelay = (i + 1) * 25 + 'ms'
      }
    }
    pageAdjust.cListsElement.appendChild(docFrag)

    if (LazyLoad) {
      window.lazyloadObj = new LazyLoad({
        elements_selector: '.lazy'
      })
    }

    document.getElementById('totalPage').innerHTML = pageAdjust.lists.length
  },

  buildPage: () => {
    var objKeys = Object.keys(LLCT.__cur_filterLists)
    pageAdjust.lists = []

    for (var i = 0; i < objKeys.length; i++) {
      var curObj = LLCT.__cur_filterLists[objKeys[i]]
      var baseElement = document.createElement('div')
      baseElement.className = 'card slide-right'
      baseElement.setAttribute(
        'onclick',
        'yohane.loadPlay("' + curObj.id + '")'
      )

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

      var played_counts = JSON.parse(dataYosoro.get('playedTimes') || '{}')[
        curObj.id
      ]

      var cardInfoWrap = document.createElement('div')
      cardInfoWrap.className = '_card_info'
      cardInfoWrap.innerHTML = played_counts
        ? '<span class="material-icons">play_arrow</span> ' + played_counts
        : ''

      c.appendChild(titleText)
      c.appendChild(cardInfoWrap)
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

  OptionManager.init()
  yohane.player().onplay = () => {
    yohaneNoDOM.play()

    if (!yohane.__useSetInterval) {
      requestAnimationFrame(yohane.tick)

      return
    }

    requestAudioSync = setInterval(() => {
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
    yohaneNoDOM.pause(true)

    if (!yohane.__useSetInterval) {
      cancelAnimationFrame(yohane.tick)

      return
    }

    if (requestAudioSync) clearInterval(requestAudioSync)
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

  if (!window.navigator.onLine) {
    _glb_ShowPopup(
      'offline_bolt',
      '오프라인 상태입니다. 온라인일 때 미리 저장된 데이터를 사용합니다.'
    )
  }

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
    yohaneNoDOM.tickIcon(v)
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
    if (yohane.__vAnimeFunc !== null && requestAudioVolume !== null) {
      yohane.__vAnimeFunc(true)
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
