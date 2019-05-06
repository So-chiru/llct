var wavTime
var flrsd
var audioSyncSleep = 0

var convertTime = function (input, separator) {
  var pad = function (input) {
    return input < 10 ? '0' + input : input
  }
  return [
    pad(Math.floor(input / 3600)),
    pad(Math.floor((input % 3600) / 60)),
    pad(Math.floor(input % 60))
  ].join(typeof separator !== 'undefined' ? separator : ':')
}

// 전부다 document.ready 이후 일어나야 할 일인가?
$(document).ready(() => {
  window.KaraokeInstance = new Karaoke(document.getElementById('karaoke'))
  logger(1, 'r', 'event : document.ready', 'i')
  window.wavesurfer = WaveSurfer.create({
    container: '#waveform',
    plugins: [WaveSurfer.cursor.create({}), WaveSurfer.regions.create({})]
  })

  wavesurfer.on('ready', () => {
    logger(1, 'r', 'event : wavesurfer_ready', 'i')
    $('#duration').html(convertTime(wavesurfer.getDuration()))
    wavesurfer.toggleScroll()
    wavesurfer.zoom(20)
  })

  wavesurfer.on('audioprocess', () => {
    wavTime = wavesurfer.getCurrentTime()
    flrsd = Math.floor(wavTime * 100)
    $('#current_time').html(convertTime(wavTime))
    $('#frame_tick').html(flrsd)

    // TODO : 더 좋은 방식은 없을까?
    // CPU 사용량 제한
    if (audioSyncSleep < 14) {
      audioSyncSleep++
      return
    }
    audioSyncSleep = 0

    KaraokeInstance.AudioSync(flrsd, true)
  })

  wavesurfer.on('seek', () => {
    KaraokeInstance.AudioSync(
      Math.floor(wavesurfer.getCurrentTime() * 100),
      true
    )
  })

  var prv = false
  $(document).keydown(e => {
    logger(1, 's', 'KeyDown event : ' + e.which, 'i')
    var onceUpdated = false
    $('input[type="text"], input[type="number"], textarea').each((i, v) => {
      if (!onceUpdated) onceUpdated = $(v).is(':focus')
    })
    if (onceUpdated) return 0
    prv = false

    // TODO : Switch 리펙토링 (이: 구조가 마음에 안듬)
    switch (e.which) {
      case 32:
        prv = true
        wavesurfer.playPause()
        break
      case 37:
        prv = true
        wavesurfer.skip(-0.2)
        break
      case 87:
        KaraokeEditor.EditVal(
          'end_time',
          Math.floor(wavesurfer.getCurrentTime() * 100) +
            KaraokeInstance.karaokeData.metadata.correction_time,
          e.altKey,
          e.shiftKey,
          true
        )
        break
      case 80:
        KaraokeEditor.EditVal(
          'pronunciation_time',
          Math.floor(wavesurfer.getCurrentTime() * 100) +
            KaraokeInstance.karaokeData.metadata.correction_time,
          e.altKey,
          e.shiftKey,
          true
        )
        break
      case 83:
        KaraokeEditor.EditVal(
          'start_time',
          Math.floor(wavesurfer.getCurrentTime() * 100) +
            KaraokeInstance.karaokeData.metadata.correction_time,
          e.altKey,
          e.shiftKey,
          true
        )
        break
      case 77:
        AudioMute()
        break
      case 39:
        prv = true
        wavesurfer.skip(0.2)
        break
      case 33:
        prv = true
        wavesurfer.skip(-30)
        break
      case 34:
        prv = true
        wavesurfer.skip(30)
        break
      case 36:
        prv = true
        wavesurfer.seekAndCenter(0)
        break
      case 18:
        prv = true
        KaraokeInstance.lineTimingValidate()
        break
      case 35:
        prv = true
        wavesurfer.seekAndCenter(1)
        break
      default:
        break
    }

    if (prv) e.preventDefault()
  })

  if (
    dataYosoro.get('useDouble') == 'undefined' ||
    dataYosoro.get('useDouble') == null
  ) {
    dataYosoro.set('useDouble', true)
  }

  document.getElementById('key_pressed_twice').checked = dataYosoro.get(
    'useDouble'
  )

  wavesurfer.on('play', () => {
    logger(1, 'r', 'event : wavesurfer_play', 'i')
    $('#playpause_audio').html('<i class="material-icons ds">pause_arrow</i>')
  })

  wavesurfer.on('pause', () => {
    logger(1, 'r', 'event : wavesurfer_pause', 'i')
    $('#playpause_audio').html('<i class="material-icons">play_arrow</i>')
  })

  wavesurfer.on('mute', isMute => {
    logger(1, 'r', 'event : wavesurfer_mute > ' + isMute, 'i')
    $('#mute_indi').html(
      '<i class="material-icons">' +
        (isMute ? 'volume_off' : 'volume_up') +
        '</i>'
    )
  })

  $('#stop_audio').click(() => {
    wavesurfer.stop()
  })

  $('#fInput').on('change', () => {
    KaraokeEditor.Import()
  })

  if (urlQueryParams('id') !== 'undefined') {
    window.songID = urlQueryParams('id')

    wavesurfer.load(
      (urlQueryParams('local') === 'true'
        ? './'
        : 'https://cdn.lovelivec.kr/') +
        'data/' +
        songID +
        '/audio.mp3'
    )
    wavesurfer.play()
  }

  KaraokeInstance.karaokeData = {
    metadata: { correction_time: -10 },
    timeline: []
  }
  window.lastSaved = JSON.stringify(KaraokeInstance.karaokeData.timeline)

  $.ajax({
    url: './data/' + window.songID + '/karaoke.json',
    success: d => {
      if (typeof d !== 'object') {
        return logger(
          0,
          'r',
          'Received karaoke json data is not valid object.',
          'e'
        )
      }
      try {
        KaraokeInstance.karaokeData = d
        window.lastSaved = JSON.stringify(KaraokeInstance.karaokeData.timeline)

        Sakurauchi.run('KaraokeLoaded')
        logger(0, 'r', 'Karaoke Data Loaded: Server Auto Load', 'i')
      } catch (e) {
        logger(0, 'r', 'Failed to load karaoke data.', 'e')
      }
    }
  })
  window.selectWords = []

  window.editorLyricsContext = new HugContext(
    document.getElementById('karaoke')
  )

  editorLyricsContext.addAction('deleteWord', ev => {
    KaraokeInstance.karaokeData.timeline[
      editorLyricsContext.targetX
    ].collection.splice(editorLyricsContext.targetY, 1)

    if (
      KaraokeInstance.karaokeData.timeline[editorLyricsContext.targetX]
        .collection.length === 0
    ) {
      KaraokeInstance.karaokeData.timeline.splice(
        editorLyricsContext.targetX,
        1
      )
    }

    KaraokeInstance.RenderDOM()
  })

  editorLyricsContext.addAction('editWord', ev => {
    var _blk_edited = prompt(
      '수정할 단어를 입력해 주세요.',
      KaraokeInstance.karaokeData.timeline[editorLyricsContext.targetX]
        .collection[editorLyricsContext.targetY].text
    )

    KaraokeInstance.karaokeData.timeline[
      editorLyricsContext.targetX
    ].collection[editorLyricsContext.targetY].text = _blk_edited
    KaraokeInstance.RenderDOM()
  })

  editorLyricsContext.addAction('addNewWord', addRight => {
    KaraokeInstance.karaokeData.timeline[
      editorLyricsContext.targetX
    ].collection.splice(
      editorLyricsContext.targetY + (addRight ? 1 : 0),
      0,
      KaraokeInstance.SpaParsing('', false)
    )

    KaraokeInstance.RenderDOM()
  })

  editorLyricsContext.addAction('addNewLine', addBottom => {
    KaraokeInstance.karaokeData.timeline.splice(
      editorLyricsContext.targetX + (addBottom ? 1 : 0),
      0,
      {
        start_time: 0,
        end_time: 0,
        collection: [Karaoke.SpaParsing('', false)]
      }
    )

    KaraokeInstance.RenderDOM()
  })

  editorLyricsContext.addAction('concatWords', () => {
    console.log(window.selectWords)
  })

  Sakurauchi.add('KaraokeLoaded', () => {
    KaraokeInstance.RenderDOM()

    if (
      typeof KaraokeInstance.karaokeData.metadata.correction_time ===
      'undefined'
    ) {
      KaraokeInstance.karaokeData.metadata.correction_time = -10
    }

    if (typeof KaraokeInstance.karaokeData.metadata.writeDone === 'undefined') {
      KaraokeInstance.karaokeData.metadata.writeDone = false
    }

    if (KaraokeInstance.karaokeData.metadata.writeDone) {
      $('.lyrics_write').addClass('__edit_hidden_tabs')
    }
  })

  KaraokeInstance.ListenClickEvent(function (instance, e) {
    var alreadyExists = false
    selectWords.forEach((v, i) => {
      if (JSON.stringify(v) === JSON.stringify(e.detail)) {
        alreadyExists = true
        selectWords.splice(i, 1)
      }
    })

    if (!alreadyExists) {
      selectWords.push(e.detail)
    }

    if (selectWords.length > 0) {
      Object.keys(valElementObject).forEach(_ =>
        $(_).val(
          instance.karaokeData.timeline[e.detail.posX].collection[
            e.detail.posY
          ][valElementObject[_]]
        )
      )
    }

    $(e.detail.perElem).toggleClass('WordSelected', !alreadyExists)

    Object.keys(valElementObject).forEach(_ =>
      $(_).attr('disabled', selectWords.length < 1)
    )
  })
})

$(window).bind('beforeunload', () => {
  if (lastSaved !== JSON.stringify(KaraokeInstance.karaokeData.timeline)) {
    return 'Export 하지 못한 데이터가 있습니다. 그래도 나갈까요?'
  }
})

var _c = {
  start_time: '#start_time_val',
  end_time: '#end_time_val',
  pronunciation_time: '#pron_time_val',
  type: '#type_val',
  ruby_text: '#ruby_text_val',
  text: '#text_val',
  tick_volume: '#tick_volume_val'
}

var valElementObject = {
  '#start_time_val': 'start_time',
  '#end_time_val': 'end_time',
  '#pron_time_val': 'pronunciation_time',
  '#type_val': 'type',
  '#ruby_text_val': 'ruby_text',
  '#text_val': 'text',
  '#tick_volume_val': 'tick_volume'
}

var __prevKCount = ['_', 0]

const KaraokeEditor = {
  EditVal: (key, value, altMode, shiftMode, NonwipingMode) => {
    $(_c[key]).val(value)
    selectWords.forEach((details, index) => {
      var selectedObject =
        KaraokeInstance.karaokeData.timeline[details.posX].collection[
          details.posY
        ]

      selectedObject[key] = value

      if (!shiftMode && altMode && index === selectWords.length - 1) {
        $(selectWords[0].perElem).toggleClass('WordSelected')
        selectWords.splice(0, 1)
      }
    })

    var UseselectionDouble = dataYosoro.get('useDouble') === true

    if (__prevKCount[0] !== key && UseselectionDouble) {
      __prevKCount = ['_', 0]
    }

    if (!NonwipingMode) {
      KaraokeInstance.RenderDOM()
      KaraokeEditor.clearSelection()
    }

    if (__prevKCount[0] === key && __prevKCount[1] >= 1 && UseselectionDouble) {
      KaraokeEditor.clearSelection()
      __prevKCount = ['_', 0]

      return
    }

    if (shiftMode && !altMode) KaraokeEditor.clearSelection()

    if (!UseselectionDouble) return 0
    __prevKCount[0] = key
    __prevKCount[1]++
  },

  toggleTextEditor: () => {
    $('.lyrics_write').toggle('__edit_hidden_tabs')

    KaraokeInstance.karaokeData.metadata.writeDone = !KaraokeInstance
      .karaokeData.metadata.writeDone
  },
  autoSpacing: spacing => {
    spacing = decodeURI(encodeURI(spacing).replace(/(%0A)/gm, '^L_F'))

    var lineData = []
    var splitLF = spacing.split('^L_F')
    for (var lineIndex = 0; lineIndex < splitLF.length; lineIndex++) {
      var line = splitLF[lineIndex]
      var spltTxt = line
        .split('')
        .join(' ')
        .replace(/\s\s\s/g, '  ')

      var spacingSplt = spltTxt.split(' ')
      var aw = false
      var fnalDt = []
      for (var d = 0; d < spacingSplt.length; d++) {
        if (
          typeof spacingSplt[d + 1] !== 'undefined' &&
          /(!|ー|！|\?|\.|？|,|、|-)/g.test(spacingSplt[d + 1]) &&
          !aw
        ) {
          fnalDt.push(spacingSplt[d] + spacingSplt[d + 1])
          aw = true
          continue
        }

        if (aw) {
          aw = false
          continue
        }

        fnalDt.push(spacingSplt[d])
      }

      lineData.push(fnalDt.join(' '))
    }

    return lineData.join('\n')
  },
  asReplacing: () => {
    $('#kashi_type').val(KaraokeEditor.autoSpacing($('#kashi_type').val()))
    KaraokeInstance.SetTimelineData(
      KaraokeInstance.Render($('#kashi_type').val())
    )
    KaraokeEditor.setLyrics($('#kashi_type').val())
  },
  clearSelection: () => {
    selectWords.forEach(v => {
      $(v.perElem).toggleClass('WordSelected', false)
    })

    selectWords = []
  },
  Import: () => {
    if (
      !window.File ||
      !window.FileReader ||
      !window.FileList ||
      !window.Blob
    ) {
      throw Error('Required APIs are not supported in this browser.')
    }

    var readInput = document.getElementById('fInput').files
    var fReader = new FileReader()
    var readJSON = null

    fReader.readAsText(readInput[0])
    fReader.onload = () => {
      try {
        readJSON = JSON.parse(fReader.result)
      } catch (e) {
        throw Error('Requested file type is not JSON.')
      }

      KaraokeInstance.karaokeData = readJSON
      $('#kashi_type').val(KaraokeInstance.karaokeData.metadata.lyrics)
      $('#blade_hex_meta').val(
        KaraokeInstance.karaokeData.metadata.bladeColorHEX
      )
      $('#blade_name_meta').val(
        KaraokeInstance.karaokeData.metadata.bladeColorMember
      )

      window.lastSaved = JSON.stringify(KaraokeInstance.karaokeData.timeline)
      Sakurauchi.run('KaraokeLoaded')
      logger(0, 'r', 'Karaoke Data Loaded.', 'i')
    }
  },
  Export: customData => {
    if (typeof window.Blob === 'undefined') {
      throw Error('Blob API is not supported in this browser.')
    }
    if (typeof KaraokeInstance.karaokeData === 'undefined') {
      throw Error('karaokeData is not defined. is the page loaded correctly?')
    }

    KaraokeInstance.lineTimingValidate()
    var aDownload = document.createElement('a')
    $('body').append(aDownload)

    var blobData = new Blob(
      [
        JSON.stringify(
          typeof customData !== 'undefined'
            ? customData
            : KaraokeInstance.karaokeData,
          null,
          2
        )
      ],
      {
        type: 'application/json'
      }
    )
    var url = URL.createObjectURL(blobData)

    aDownload.href = url
    aDownload.download = songID + '.json'
    aDownload.click()
    window.URL.revokeObjectURL(url)

    window.lastSaved = JSON.stringify(KaraokeInstance.karaokeData)
  },

  setLyrics: data => {
    KaraokeInstance.karaokeData.metadata.lyrics = data
  }
}

const AudioMute = () => {
  wavesurfer.setMute(!wavesurfer.getMute())
  $('#mute_btn').html(
    wavesurfer.getMute()
      ? '<i class="material-icons">volume_off</i>'
      : '<i class="material-icons">volume_up</i>'
  )
}

var pageBtnLists = ['#metadata_select', '#timeline_select']
var pageLists = ['#metadata_editor', '#timeline_editor']
var currentPage = pageLists[0]
var currentPageBtn = pageBtnLists[0]

const switchTab = tab => {
  $(currentPage).removeClass('currentPage')
  $(currentPage).addClass('notCurrentpage')
  $(currentPageBtn).removeClass('selected_btn')

  $(pageLists[tab]).removeClass('notCurrentpage')
  $(pageLists[tab]).addClass('currentPage')
  $(pageBtnLists[tab]).addClass('selected_btn')

  currentPage = pageLists[tab]
  currentPageBtn = pageBtnLists[tab]
}

window.KaraokeEditor = KaraokeEditor
