let requestAudioSync
let requestAudioVolume = null

let LLCTLayers = ['setting_layer', 'switch_layer']
let GroupCSSSelector = {
  "µ's": 'muse',
  Aqours: 'aqours',
  虹同: 'niji'
}

let LLCT = {
  __pkg_callLists: [],
  __cur_filterLists: [],
  __playPointer: null,
  hideLayer: i => {
    document.getElementById(LLCTLayers[i]).classList.remove('show')
    document.getElementById(LLCTLayers[i]).classList.add('hide')
    document.querySelector('#' + LLCTLayers[i] + ' .layer_sc').style.transform =
      'scale(1.2)'
  },
  showLayer: i => {
    document.getElementById(LLCTLayers[i]).classList.remove('hide')
    document.getElementById(LLCTLayers[i]).classList.add('show')
    document.querySelector('#' + LLCTLayers[i] + ' .layer_sc').style.transform =
      'scale(1.0)'
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
      pageAdjust.currentPage + 1
    )
    if (typeof __askd_result === 'undefined' || isNaN(__askd_result)) return 0
    pageAdjust.setPage(Number(__askd_result) - 1)
  },
  setTitleTo: t => {
    document.getElementById('p_title').innerHTML = t
  },
  /**
   * selectGroup: 리스트에 표시할 그룹을 표시합니다.
   * @param {String} i 그룹의 Index. 0: 뮤즈, 1: 아쿠아, 2: 니지가사키
   * @param {Boolean} notLayer 레이어가 아닌지에 대한 여부
   * @param {Boolean} auto 자동으로 실행되었는지 (pid에 따른 자동 그룹 선택 방지)
   */
  selectGroup: (i, notLayer, auto) => {
    var groupBAK = LLCT.__cur_selectedGroup
    LLCT.__cur_selectedGroup = Object.keys(LLCT.fullMetaData)[i]
    LLCT.__pkg_callLists =
      LLCT.fullMetaData[LLCT.__cur_selectedGroup].collection
    LLCT.__playPointer = null
    LLCT.__cur_filterLists =
      LLCT.fullMetaData[LLCT.__cur_selectedGroup].collection

    var groupSelection = document.getElementById('group_selection_btn')
    groupSelection.innerHTML = LLCT.__cur_selectedGroup
    groupSelection.className += ' ' + GroupCSSSelector[LLCT.__cur_selectedGroup]

    if (groupBAK && groupBAK != '') {
      groupSelection.className = groupSelection.className.replace(
        ' ' + GroupCSSSelector[groupBAK],
        ''
      )
    }
    pageAdjust.buildPage()
    if (!auto) {
      dataYosoro.set('lastGroup', i)
    }
    if (!notLayer) {
      LLCT.hideLayer(1)
    }
  },
  currentPage: 0,
  openCallImage: id => {
    var pElement = document.getElementById('ps_wp')
    var items = [
      {
        src:
          (urlQueryParams('local') === 'true'
            ? './'
            : 'https://cdn-mikan.lovelivec.kr/') +
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
  },
  loadCallImage: id => {
    yohaneNoDOM.hideLyrics()
    document.getElementById('karaoke').innerHTML =
      `<img class="call_img" onclick="LLCT.openCallImage('${id}')" src="` +
      (urlQueryParams('local') === 'true'
        ? './'
        : 'https://cdn-mikan.lovelivec.kr/') +
      'data/' +
      id +
      '/call.jpg' +
      '" onload="yohaneNoDOM.showLyrics()"></img>'
    yohaneNoDOM.shokan()
  },
  loadLyrics: id => {
    yohaneNoDOM.hideLyrics()
    yohaneNoDOM.shokan()
    fetch('./data/' + id + '/karaoke.json')
      .then(res => {
        try {
          res.json().then(v => {
            KaraokeInstance.karaokeData = v
            KaraokeInstance.RenderDOM(dataYosoro.get('romaji'))
            yohaneNoDOM.showLyrics()
          })
        } catch (e) {
          return logger(
            2,
            'r',
            'Failed to parse karaoke json. : ' + e.stack,
            'e'
          )
        }
      })
      .catch(e => {
        return logger(2, 'r', 'Failed to get karaoke file. : ' + e.stack, 'e')
      })
  },
  getFromLists: id => {
    var v = Object.keys(LLCT.__pkg_callLists)
    for (var i = 0; i < v.length; i++) {
      var vi = v[i]
      if (LLCT.__pkg_callLists[vi].id != id) continue

      return [vi, LLCT.__pkg_callLists[vi], i]
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
    Sakurauchi.delisten('canplaythrough', 'a', yohane.player())
    Sakurauchi.listen(
      'canplaythrough',
      () => {
        yohaneNoDOM.__cachedElement['bar_eventListen'].classList.remove('__buf')
      },
      yohane.player()
    )
  },
  dekakuOnce: target => {
    if (
      /material\-icons/g.test(target.className) ||
      /__progress/g.test(target.className)
    ) {
      return 0
    }
    if (!yohaneNoDOM.kaizu) {
      yohaneNoDOM.dekakuni()
    }
  },
  toggleKaizu: () => {
    yohaneNoDOM.kaizu ? yohaneNoDOM.chiisakuni() : yohaneNoDOM.dekakuni()
  },
  dekakuni: () => {
    var pl_bg = document.getElementById('pl_bg')
    pl_bg.classList.add('show')
    document.getElementsByClassName('player')[0].classList.add('dekai')
    yohaneNoDOM.kaizu = true
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    pl_bg.style.opacity = 1
    KaraokeInstance.clearSync()
  },
  hideLyrics: () => {
    document.getElementById('lyrics_wrap').classList.add('hiddenCurtain')
    document.getElementById('lyrics_wrap_inner').classList.add('hiddenCurtain')
  },
  showLyrics: () => {
    document.getElementById('lyrics_wrap').classList.remove('hiddenCurtain')
    document
      .getElementById('lyrics_wrap_inner')
      .classList.remove('hiddenCurtain')
  },
  chiisakuni: () => {
    var pl_bg = document.getElementsByClassName('player_bg')[0]
    pl_bg.classList.remove('show')
    pl_bg.style.opacity = '0'
    document.getElementsByClassName('player')[0].classList.remove('dekai')
    yohaneNoDOM.kaizu = false
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  },
  play: () => {
    anime({
      targets: '#pp_btn',
      rotate: 60,
      opacity: 0,
      delay: 0,
      duration: 150,
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
      duration: 200,
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
      duration: 150,
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
      duration: 100,
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
    if (yohane.is_repeat) {
      document.getElementById('pl_loop').innerHTML = 'loop'
    }
    document
      .getElementById('pl_loop')
      .classList[yohane.is_shuffle || yohane.is_repeat ? 'remove' : 'add'](
        'in_active'
      )
  },
  playingNextToggle: () => {
    if (yohane.is_shuffle) {
      document.getElementById('pl_loop').innerHTML = 'shuffle'
    }
    document
      .getElementById('pl_loop')
      .classList[yohane.is_shuffle || yohane.is_repeat ? 'remove' : 'add'](
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
          : 'https://cdn-mikan.lovelivec.kr/') +
        'data/' +
        id +
        '/bg.png'
    } else {
      document.getElementById('album_meta').src = '/live_assets/1px.png'
      document.getElementById(
        'album_meta'
      ).style.backgroundColor = dataYosoro.get('yohane') ? '#323232' : '#D0D0D0'
    }

    var artistText =
      LLCT.fullMetaData[LLCT.__cur_selectedGroup].meta.artists[
        meta[1].artist != null ? meta[1].artist : 0
      ]
    document.getElementById('title_meta').innerText =
      dataYosoro.get('mikan') === true ? meta[1].translated || meta[0] : meta[0]
    document.getElementById('artist_meta').innerText = artistText
    document.getElementById('artist_meta').title = artistText

    document.getElementById('blade_color').innerText =
      meta[1].bladeColor || '자유'

    var _hx = meta[1].bladeColorHEX
    document.getElementById('blade_color').style.color =
      _hx != null && _hx != 'null' && _hx != '#000000' && _hx != ''
        ? _hx
        : dataYosoro.get('yohane')
          ? '#FFF'
          : '#000'

    document.getElementById('blade_color').style.textShadow =
      '0px 0px 4px ' + document.getElementById('blade_color').style.color

    document.getElementById('sing_tg').style.display = meta[1].singAlong
      ? 'block'
      : 'none'
    document.getElementById('performed_tg').style.display = meta[1].notPerformed
      ? 'block'
      : 'none'
    document.title = meta[1].kr || meta[0] || '제목 미 지정'

    Sakurauchi.run('audioLoadStart', [
      meta[1].kr || meta[0],
      artistText,
      meta[1]
    ])

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
  prev: skipDekaku => {
    var objK = Object.keys(LLCT.__cur_filterLists)
    if (!LLCT.__playPointer) {
      LLCT.__playPointer = objK.length - 1
    }
    LLCT.__playPointer = (LLCT.__playPointer - 1 + objK.length) % objK.length
    yohane.loadPlay(
      LLCT.__cur_filterLists[objK[LLCT.__playPointer]].id,
      skipDekaku
    )
  },
  next: skipDekaku => {
    var objK = Object.keys(LLCT.__cur_filterLists)
    if (!LLCT.__playPointer) {
      LLCT.__playPointer = 0
    }
    LLCT.__playPointer = (LLCT.__playPointer + 1) % objK.length
    yohane.loadPlay(
      LLCT.__cur_filterLists[objK[LLCT.__playPointer]].id,
      skipDekaku
    )
  },
  shuffle: skipDekaku => {
    var objK = Object.keys(LLCT.__cur_filterLists)
    var id = (Math.random() * objK.length) << 0
    LLCT.__playPointer = id

    yohane.loadPlay(LLCT.__cur_filterLists[objK[id]].id, skipDekaku)
  },
  setVolume: v => {
    yohane.volumeStore = v
    yohane.player().volume = v
  },
  pl_cc: null,
  player: () => {
    if (!yohane.pl_cc) {
      yohane.pl_cc = document.getElementById('kara_audio')
    }
    return yohane.pl_cc
  },
  is_repeat: false,
  is_shuffle: false,
  repeatToggle: () => {
    yohane.is_repeat = !yohane.is_repeat
    yohaneNoDOM.loopToggle()
  },
  playNextToggle: () => {
    yohane.is_shuffle = !yohane.is_shuffle
    yohaneNoDOM.playingNextToggle()
  },
  toggleLoops: () => {
    if (!yohane.is_repeat && !yohane.is_shuffle) {
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
    if (yohane.is_repeat && !yohane.is_shuffle) {
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
    if (!yohane.is_repeat && yohane.is_shuffle) {
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
    yohane[!yohane.playing() ? 'play' : 'pause']()
  },
  playing: () => !yohane.player().paused,
  timecode: () => yohane.player().currentTime * 100,
  seekTo: zto => {
    if (yohane.playing()) yohane.pause(false, true)
    yohane.player().currentTime = yohane.player().duration * (zto / 100)
    yohane.player().volume = yohane.volumeStore
    yohane.play(true)
  },
  seekPrev: s => {
    yohane.player().currentTime =
      yohane.player().currentTime - s < 0 ? 0 : yohane.player().currentTime - s
  },
  seekNext: s => {
    yohane.player().currentTime =
      yohane.player().currentTime + s > yohane.player().duration
        ? (yohane.player().duration - yohane.player().currentTime) / 2
        : yohane.player().currentTime + s
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
    if (navigator.mediaSession) {
      var meta = LLCT.getFromLists(popsHeart.get('pid'))
      LLCT.__playPointer = meta[2]
      var artistText =
        LLCT.fullMetaData[LLCT.__cur_selectedGroup].meta.artists[
          meta[1].artist != null ? meta[1].artist : 0
        ]
      navigator.mediaSession.playbackState = 'playing'
      Sakurauchi.run('audioLoadStart', [
        meta[1].kr || meta[0],
        artistText,
        meta[1]
      ])
      yohane.player().play()
    } else {
      yohane
        .player()
        .play()
        .then()
    }
    if (force) return 0
    yohane.fade(0, yohane.volumeStore, 150, performance.now(), () => {})
  },
  pause: (returnZero, force) => {
    yohaneNoDOM.pause()
    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = 'paused'
    }
    if (force) return yohane.player()[returnZero ? 'stop' : 'pause']()
    yohane.fade(yohane.player().volume, 0, 150, performance.now(), () => {
      yohane.player()[returnZero ? 'stop' : 'pause']()
    })
  },
  tick: _ => {
    if (!yohane.playing()) {
      cancelAnimationFrame(requestAudioSync)
      return
    }
    requestAudioSync = requestAnimationFrame(yohane.tick)
    if (
      yohaneNoDOM.kaizu &&
      typeof KaraokeInstance.karaokeData !== 'undefined' &&
      KaraokeInstance.karaokeData !== null &&
      KaraokeInstance.karaokeData.timeline
    ) {
      KaraokeInstance.AudioSync(yohane.timecode())
    }
    var _ct = yohane.player().currentTime
    var _dr = yohane.player().duration
    if (yohane.tickVal % 2 === 0) {
      var calc_t = _ct / _dr
      yohaneNoDOM.__cachedElement.psd_times.style.width = calc_t * 100 + '%'
      yohaneNoDOM.__cachedElement.__current_thumb.style.transform =
        'translateX(' + yohane.__tickCaching._clw * calc_t + 'px)'
    }
    if (yohane.tickVal == null || yohane.tickVal > 16) {
      yohane.tickVal = 0
      yohane.deferTick(_ct, _dr)
    }
    yohane.tickVal++
  },
  __tickCaching: {},
  deferTick: (_ct, _dr) => {
    if (yohane.__tickCaching._clw == null) {
      yohane.__tickCaching._clw =
        yohaneNoDOM.__cachedElement.bar_eventListen.clientWidth
    }
    yohaneNoDOM.__cachedElement['played_time'].innerHTML = numToTS(_ct) || '??'
    yohaneNoDOM.__cachedElement['left_time'].innerHTML =
      '-' + (numToTS(_dr - _ct) || '??')
  },
  initialize: id => {
    KaraokeInstance.karaokeData = null
    yohaneNoDOM.initialize(id)

    if (dataYosoro.get('notUsingMP')) {
      LLCT.openCallImage(id)
      return false
    }
    try {
      yohane.player().src =
        (urlQueryParams('local') === 'true'
          ? './'
          : 'https://cdn-mikan.lovelivec.kr/') +
        'data/' +
        id +
        '/audio.mp3'
      yohane.setVolume(yohane.volumeStore !== null ? yohane.volumeStore : 0.5)
    } catch (e) {
      return logger(2, 'r', e.message, 'e')
    }
    yohane.__tickCaching = {}
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
  clis_elem: null,
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
    if (!pageAdjust.clis_elem) {
      pageAdjust.clis_elem = document.getElementById('_card_lists')
    }
    pageAdjust.clis_elem.innerHTML = ''
    if (!pg) pg = 0
    var docFrag = document.createDocumentFragment()
    for (var i = 0, ls = pageAdjust.lists[pg].length; i <= ls; i++) {
      if (typeof pageAdjust.lists[pg][i] !== 'undefined') {
        var pgI = pageAdjust.lists[pg][i]
        docFrag.appendChild(pgI)
        pgI.style.animationDelay = (i + 1) * 25 + 'ms'
      }
    }
    pageAdjust.clis_elem.appendChild(docFrag)
    if (window.LazyLoad) {
      window.nLazy = new LazyLoad({
        elements_selector: '.lazy',
        class_loaded: 'llct_loaded'
      })
    }
    document.getElementById('totalPage').innerHTML = pageAdjust.lists.length
  },
  buildPage: () => {
    var objKeys = Object.keys(LLCT.__cur_filterLists)
    pageAdjust.lists = []
    for (var i = 0; i < objKeys.length; i++) {
      var curObj = LLCT.__cur_filterLists[objKeys[i]]
      var baseElement = document.createElement('llct-card')
      baseElement.className = 'slide-right'
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
        artImage.dataset.src = dataYosoro.get('devMode')
          ? 'data/10001/bg.png'
          : (urlQueryParams('local') === 'true'
            ? './'
            : 'https://cdn-mikan.lovelivec.kr/') +
            'data/' +
            curObj.id +
            '/bg.png'
        c.appendChild(artImage)
      } else {
        baseElement.style.backgroundColor = '#323232'
      }

      var in_text = dataYosoro.get('devMode')
        ? '#' + curObj.id + '_DEV'
        : dataYosoro.get('mikan') === true
          ? curObj.translated || objKeys[i]
          : objKeys[i]
      var titleText = document.createElement('h3')
      titleText.className = 'txt'
      titleText.innerText = in_text
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
// 키를 누를때 동작할 함수들을 미리 지정합니다.
const keys = {
  27: [e => yohaneNoDOM.chiisakuni(), false],
  32: [e => yohane.toggle(), true],
  37: [e => yohane.seekPrev(5), true],
  38: [e => yohane.volumeUp(0.05), true],
  39: [e => yohane.seekNext(5), true],
  40: [e => yohane.volumeDown(0.05), true]
}
// 키가 입력 되었을 때 키를 입력합니다.
Sakurauchi.listen('keydown', ev => {
  logger(2, 's', ev.key + ' / ' + ev.keyCode, 'info')
  if (typeof keys[ev.keyCode] === 'undefined') return 0
  keys[ev.keyCode][0](ev)
  if (keys[ev.keyCode][1]) ev.preventDefault()
})
// Karaoke 관련 Initialize
Sakurauchi.add('LLCTLoad', () => {
  window.KaraokeInstance = new Karaoke(document.getElementById('karaoke'))
  document.getElementById('kara_player').onclick = ev => {
    yohaneNoDOM.dekakuOnce(ev.target)
  }
  KaraokeInstance.ListenClickEvent(function (instance, e) {
    document.getElementById('kara_audio').currentTime =
      instance.karaokeData.timeline[e.detail.posX].collection[e.detail.posY]
        .start_time /
        100 -
      0.03
  })
  Sakurauchi.listen(
    ['seeking', 'seeked'],
    () => {
      KaraokeInstance.tickSoundsCache = {}
      KaraokeInstance.clearSync(() => {
        KaraokeInstance.AudioSync(Math.floor(yohane.timecode()), true)
      })
    },
    yohane.player()
  )
  KaraokeInstance.tickSoundEnable =
    dataYosoro.get('biTick') == null ||
    typeof dataYosoro.get('biTick') === 'undefined'
      ? true
      : !!dataYosoro.get('biTick')
  Sakurauchi.run('tickSoundChanged', KaraokeInstance.tickSoundEnable)
  yohane.player().onplay = () => {
    yohaneNoDOM.play()
    requestAnimationFrame(yohane.tick)
  }
  yohane.player().onended = () => {
    if (yohane.is_repeat) {
      yohane.seekTo(0)
      yohane.play()
      return
    }
    yohaneNoDOM.end()
    if (yohane.is_shuffle) {
      yohane.next(!yohane.kaizu)
    }
  }
  yohane.player().onpause = () => {
    yohaneNoDOM.pause(true)
    cancelAnimationFrame(yohane.tick)
  }
})
// 플레이어 관련
Sakurauchi.add('LLCTLoad', () => {
  window.playerHammer = new Hammer(document.getElementById('dash_wrp_ham'))
  playerHammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL })
  playerHammer.get('pinch').set({ enable: true })
  playerHammer.on('swipe', ev => {
    if (ev.direction === 16) {
      yohaneNoDOM.kaizu ? yohaneNoDOM.chiisakuni() : yohane.giran()
    } else if (ev.direction === 8) {
      yohaneNoDOM.dekakuni()
    }
    document.getElementById('kara_player').style.transform = 'translateY(0px)'
  })
  var closeVal = 0
  var closeDir = 0
  var originCalc = null
  var domGPLBg = document.getElementById('pl_bg')
  var domGPLKa = document.getElementById('kara_player')
  var __bak_style = 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1) 0s'
  playerHammer.on('panstart', ev => {
    __bak_style = domGPLKa.style.transition
    domGPLKa.style.transition = 'unset'
    domGPLBg.classList.add('show')
    yohaneNoDOM.hideLyrics()
  })
  playerHammer.on('panend', ev => {
    yohaneNoDOM.showLyrics()
    domGPLKa.style.transition = __bak_style
    if (closeVal < -250) {
      yohaneNoDOM.dekakuni(true)
    } else if (closeVal > 250 && !closeDir) {
      yohaneNoDOM.chiisakuni(true)
    }
    domGPLKa.style.transform = 'translateY(0px)'
    domGPLKa.style.height = null
    closeVal = 0
    closeDir = 0
    originCalc = null
    !yohaneNoDOM.kaizu && domGPLBg.classList.remove('show')
  })
  playerHammer.on('pan', ev => {
    if (!originCalc) {
      originCalc = domGPLKa.clientHeight
    }
    closeVal = ev.deltaY
    closeDir = ev.additionalEvent === 'panup'
    if (ev.additionalEvent == 'panup' || ev.additionalEvent == 'pandown') {
      if (ev.deltaY > 0) {
        domGPLKa.style.transform = 'translateY(' + ev.deltaY + 'px)'
      }
      domGPLBg.style.opacity = yohaneNoDOM.kaizu
        ? 1 - ev.deltaY / window.innerHeight
        : 1 - (ev.deltaY / window.innerHeight + 1)
      if (ev.deltaY < 0) {
        domGPLKa.style.height = originCalc + closeVal * -1 + 'px'
      }
    }
  })
})
// Tether 사용
Sakurauchi.add('LLCTLoad', () => {
  new Tether({
    element: document.getElementById('__context_frame'),
    target: document.getElementById('more_vertical_options'),
    attachment: 'top right',
    targetAttachment: 'top left'
  })
})
Sakurauchi.add('LLCTLoad', () => {
  window.vertialMenusContext = new HugContext(
    document.getElementById('more_vertical_options')
  )
  document
    .getElementById('more_vertical_options')
    .addEventListener('click', ev => {
      vertialMenusContext.openContext(ev, true)
    })
  vertialMenusContext.addAction('openSettings', ev => {
    LLCT.showLayer(0)
  })
  vertialMenusContext.addAction('openCalendar', ev => {
    window.location.href = 'https://all.lovelivec.kr'
  })
  vertialMenusContext.addAction('shuffleMusic', ev => {
    yohane.shuffle()
  })
})
Sakurauchi.add('LLCTLoad', () => {
  // 카드 형 곡 선택 화면의 Swipe 감지
  window.selectorHammer = new Hammer(document.getElementById('fp_ct'))
  selectorHammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
  selectorHammer.on('swipe', ev => {
    pageAdjust[ev.direction === 2 ? 'nextPage' : 'prevPage']()
  })
  fetch('./data/lists.json').then(res => {
    res.json().then(v => {
      LLCT.fullMetaData = v
      document.getElementById('loading_spin_ctlst').classList.add('done')
      if (popsHeart.get('pid') !== null && popsHeart.get('pid') !== '') {
        LLCT.selectGroup(popsHeart.get('pid').substring(0, 1), true, true)
        yohane.initialize(popsHeart.get('pid'))
        if (!dataYosoro.get('doNotUseMusicPlayer')) {
          yohaneNoDOM.dekakuni()
        }
        return
      }
      // 마지막으로 선택한 그룹이 있는지에 대한 여부입니다.
      var NoLastGroup =
        dataYosoro.get('lastGroup') == null ||
        typeof dataYosoro.get('lastGroup') === 'undefined'
      LLCT.selectGroup(NoLastGroup ? 1 : dataYosoro.get('lastGroup'), true)
    })
  })
  if (!window.navigator.onLine) {
    showPopup(
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
  Sakurauchi.add('tickSounds', vol_d => {
    var tickSound = document.getElementById('tick_sounds')
    tickSound.currentTime = 0
    tickSound.play()

    tickSound.volume = vol_d || 1
  })
  Sakurauchi.add('tickSoundChanged', v => {
    yohaneNoDOM.tickIcon(v)
    document
      .getElementById('tick_btn')
      .classList[v ? 'remove' : 'add']('in_active')

    dataYosoro.set('biTick', v)
  })
  Sakurauchi.listen('audioLoadStart', data => {
    if (!navigator.mediaSession) return 0
    let titleData =
      dataYosoro.get('mikan') === true &&
      data[2].translated &&
      data[2].translated != data[0]
        ? data[2].translated + ' (' + data[0] + ')'
        : data[0]
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titleData,
      artist: data[1],
      album: data[2].album || 'Single',
      artwork: [
        {
          src: 'https://cdn-mikan.lovelivec.kr/data/' + data[2].id + '/bg.png'
        }
      ]
    })
  })
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
    KaraokeInstance.clearSync()
    KaraokeInstance.AudioSync(yohane.timecode(), true)
  })
  document.getElementById('lyrics_wrap').addEventListener(
    'scroll',
    () => {
      KaraokeInstance.updateLastScroll()
    },
    false
  )
  Sakurauchi.listen('blur', () => {
    if (yohane.__vAnimeFunc !== null && requestAudioVolume !== null) {
      yohane.__vAnimeFunc(true)
    }
  })
  Sakurauchi.listen('resize', resizeFunctions, window)
  pageAdjust.onePageItems = resizeItemsCheck()
  // 플레이어 배경 색상
  var _ctf = new ColorThief()
  var album_meta = document.getElementById('album_meta')
  album_meta.crossOrigin = 'Anonymous'
  var __cf_ng = ['217deg', '127deg', '336deg']
  album_meta.addEventListener('load', () => {
    if (dataYosoro.get('piigi') != true) return
    var paletteData = _ctf.getPalette(album_meta, 4)
    var fn_background = ''
    for (var i = 0; i < 3; i++) {
      if (paletteData == null) break
      var c = paletteData[i]
      fn_background +=
        'linear-gradient(' +
        __cf_ng[i] +
        ',rgba(' +
        c[0] +
        ', ' +
        c[1] +
        ',' +
        c[2] +
        ',0.8),rgba(0,0,0,0) 70.71%)' +
        (i < 2 ? ',' : '')
    }
    document.getElementById('cl_layer_player').style.background = fn_background
  })
  document.getElementById('curt').classList.add('hide_curtain')
})
let resizeFunctions = () => {
  var reszCk = resizeItemsCheck()
  if (pageAdjust.onePageItems !== reszCk) {
    pageAdjust.onePageItems = reszCk
    pageAdjust.buildPage()
  }
  pageAdjust.onePageItems = reszCk
  yohane.__tickCaching._clw = null
}
if (navigator.mediaSession) {
  navigator.mediaSession.setActionHandler('play', () => {
    yohane.play()
  })
  navigator.mediaSession.setActionHandler('pause', () => {
    yohane.pause()
  })
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    yohane.prev()
  })
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    yohane[yohane.is_shuffle ? 'shuffle' : 'next']()
  })
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    yohane.seekPrev(5)
  })
  navigator.mediaSession.setActionHandler('seekforward', () => {
    yohane.seekNext(5)
  })
}
