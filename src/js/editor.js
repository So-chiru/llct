var convertTime = function (input, separator) {
  var pad = function (input) {
    return input < 10 ? '0' + input : input
  }
  return [
    pad(~~(input / 3600)),
    pad(~~((input % 3600) / 60)),
    pad(~~(input % 60))
  ].join(typeof separator !== 'undefined' ? separator : ':')
}

var registerEditorAFrame = null

var registerTimeUpdate = () => {
  var wavTime = wavesurfer.getCurrentTime()
  var flrsd = ~~(wavTime * 100)

  document.getElementById('current_time').innerHTML = convertTime(wavTime)
  document.getElementById('frame_tick').innerHTML = flrsd

  KaraokeInstance.AudioSync(flrsd, false)

  registerEditorAFrame = requestAnimationFrame(registerTimeUpdate)
}

var EditorKeyBinds = {
  32: () => {
    wavesurfer.playPause()
  },
  37: () => {
    wavesurfer.skip(-0.2)
  },
  9: () => {
    wavesurfer.skip(-0.2)
  },
  87: e => {
    KaraokeEditor.EditVal(
      'end_time',
      Math.floor(wavesurfer.getCurrentTime() * 100) +
        KaraokeInstance.karaokeData.metadata.correction_time,
      e.altKey,
      e.shiftKey,
      true
    )
    return true
  },
  221: e => {
    KaraokeEditor.EditVal(
      'end_time',
      Math.floor(wavesurfer.getCurrentTime() * 100) +
        KaraokeInstance.karaokeData.metadata.correction_time,
      true,
      e.shiftKey,
      true
    )
    return true
  },
  80: e => {
    KaraokeEditor.EditVal(
      'pronunciation_time',
      Math.floor(wavesurfer.getCurrentTime() * 100) +
        KaraokeInstance.karaokeData.metadata.correction_time,
      e.altKey,
      e.shiftKey,
      true
    )
    return true
  },
  83: e => {
    KaraokeEditor.EditVal(
      'start_time',
      Math.floor(wavesurfer.getCurrentTime() * 100) +
        KaraokeInstance.karaokeData.metadata.correction_time,
      e.altKey,
      e.shiftKey,
      true
    )
    return true
  },
  46: () => {
    KaraokeEditor.DeleteSelection()
    return true
  },
  219: e => {
    KaraokeEditor.EditVal(
      'start_time',
      Math.floor(wavesurfer.getCurrentTime() * 100) +
        KaraokeInstance.karaokeData.metadata.correction_time,
      true,
      e.shiftKey,
      true
    )
    return true
  },
  77: () => {
    AudioMute()
    return true
  },
  39: () => {
    wavesurfer.skip(0.2)
  },
  81: () => {
    wavesurfer.skip(0.2)
  },
  33: () => {
    wavesurfer.skip(-30)
  },
  34: () => {
    wavesurfer.skip(30)
  },
  36: () => {
    wavesurfer.seekAndCenter(0)
  },
  18: () => {
    KaraokeInstance.lineTimingValidate()
  },
  35: () => {
    wavesurfer.seekAndCenter(1)
  }
}

// 전부다 document.ready 이후 일어나야 할 일인가?
$(document).ready(() => {
  window.KaraokeInstance = new Karaoke(document.getElementById('karaoke'))
  logger.info(1, 'r', 'event : document.ready')
  window.wavesurfer = WaveSurfer.create({
    container: '#waveform',
    plugins: [WaveSurfer.cursor.create({}), WaveSurfer.regions.create({})]
  })

  wavesurfer.on('ready', () => {
    logger.info(1, 'r', 'event : wavesurfer_ready')
    $('#duration').html(convertTime(wavesurfer.getDuration()))
    wavesurfer.toggleScroll()
    wavesurfer.zoom(20)
  })

  wavesurfer.on('play', () => {
    registerTimeUpdate()
  })

  wavesurfer.on('seek', () => {
    KaraokeInstance.tickSoundsCache = {}
  })

  wavesurfer.on('pause', () => {
    if (registerEditorAFrame) {
      cancelAnimationFrame(registerEditorAFrame)
      registerEditorAFrame = null
    }
  })

  wavesurfer.on('seek', () => {
    KaraokeInstance.clearSync()
    KaraokeInstance.AudioSync(~~(wavesurfer.getCurrentTime() * 100), true)
  })

  $(document).keydown(e => {
    logger.info(1, 's', 'KeyDown event : ' + e.which)

    var inputs = [
      'input[type="text"]:focus',
      'input[type="number"]:focus',
      'textarea:focus'
    ].filter(v => {
      return document.querySelectorAll(v).length !== 0
    })

    if (inputs.length == 0) {
      var def_action = true

      if (typeof EditorKeyBinds[e.which] !== 'undefined') {
        def_action = EditorKeyBinds[e.which](e)
      }

      if (!def_action) {
        e.preventDefault()
      }
    }
  })

  wavesurfer.on('play', () => {
    logger.info(1, 'r', 'event : wavesurfer_play')
    $('#playpause_audio').html('<i class="material-icons ds">pause_arrow</i>')
  })

  wavesurfer.on('pause', () => {
    logger.info(1, 'r', 'event : wavesurfer_pause')
    $('#playpause_audio').html('<i class="material-icons">play_arrow</i>')
  })

  wavesurfer.on('mute', isMute => {
    logger.info(1, 'r', 'event : wavesurfer_mute > ' + isMute)
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

    wavesurfer.load('./data/' + songID + '/audio.mp3')
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
        return logger.error(
          0,
          'r',
          'Received karaoke json data is not valid object.'
        )
      }
      try {
        KaraokeInstance.karaokeData = d
        window.lastSaved = JSON.stringify(KaraokeInstance.karaokeData.timeline)

        Sakurauchi.run('KaraokeLoaded')
        logger.info(0, 'r', 'Karaoke Data Loaded: Server Auto Load')
      } catch (e) {
        logger.error(0, 'r', 'Failed to load karaoke data.')
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

    KaraokeEditor.RenderDOM()
  })

  editorLyricsContext.addAction('editWord', ev => {
    var _blk_edited = prompt(
      '수정할 단어를 입력해 주세요.',
      KaraokeInstance.karaokeData.timeline[editorLyricsContext.targetX]
        .collection[editorLyricsContext.targetY].text
    )

    if (!_blk_edited) return false

    KaraokeInstance.karaokeData.timeline[
      editorLyricsContext.targetX
    ].collection[editorLyricsContext.targetY].text = _blk_edited
    KaraokeEditor.RenderDOM()
  })

  editorLyricsContext.addAction('addNewWord', addRight => {
    KaraokeInstance.karaokeData.timeline[
      editorLyricsContext.targetX
    ].collection.splice(
      editorLyricsContext.targetY + (addRight ? 1 : 0),
      0,
      KaraokeInstance.KaraWorldStructure('', false)
    )

    KaraokeEditor.RenderDOM()
  })

  editorLyricsContext.addAction('addNewLine', addBottom => {
    KaraokeInstance.karaokeData.timeline.splice(
      editorLyricsContext.targetX + (addBottom ? 1 : 0),
      0,
      {
        start_time: 0,
        end_time: 0,
        collection: [KaraokeInstance.KaraWorldStructure('', false)]
      }
    )

    KaraokeEditor.RenderDOM()
  })

  editorLyricsContext.addAction('concatWords', () => {
    var firstPoX = selectWords[0].posX

    var words_len = selectWords.length

    if (words_len < 2) {
      alert('최소 2개 이상의 단어를 선택하세요.')
      return false
    }

    var fin_text = ''

    for (var i = 0; i < words_len; i++) {
      var selectedWord = selectWords[i]
      if (selectedWord.posX !== firstPoX) {
        alert(
          '선택된 ' +
            selectedWord.posX +
            '번째 줄의 선택 단어는 ' +
            firstPoX +
            '번째의 단어와 병합될 수 없습니다. 같은 줄 안에서 처리 해 주세요.'
        )
        return false
      }

      fin_text +=
        KaraokeInstance.karaokeData.timeline[selectedWord.posX].collection[
          selectedWord.posY
        ].text

      if (i !== 0) {
        KaraokeInstance.karaokeData.timeline[selectedWord.posX].collection[
          selectedWord.posY
        ] = 'MARK_RM'
      }
    }

    KaraokeInstance.karaokeData.timeline[selectWords[0].posX].collection[
      selectWords[0].posY
    ].text = fin_text
    KaraokeEditor.removeMarked()
    KaraokeEditor.RenderDOM()
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
  repeat_delay: '#repeat_delay_val',
  ruby_text: '#ruby_text_val',
  text: '#text_val',
  text_color: '#text_color_val',
  tick_volume: '#tick_volume_val'
}

var valElementObject = {
  '#start_time_val': 'start_time',
  '#end_time_val': 'end_time',
  '#pron_time_val': 'pronunciation_time',
  '#type_val': 'type',
  '#repeat_delay_val': 'repeat_delay',
  '#ruby_text_val': 'ruby_text',
  '#text_val': 'text',
  '#tick_volume_val': 'tick_volume'
}

var __prevKCount = ['_', 0]

const KaraokeEditor = {
  RenderDOM: () => {
    KaraokeEditor.clearSelection()
    return KaraokeInstance.RenderDOM()
  },

  EditVal: (key, value, altMode, shiftMode, NonwipingMode) => {
    document.querySelector(_c[key]).value = value

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

    KaraokeInstance.lineTimingValidate()

    if (__prevKCount[0] !== key) {
      __prevKCount = ['_', 0]
    }

    if (!NonwipingMode) {
      KaraokeEditor.RenderDOM()
    }

    if (__prevKCount[0] === key && __prevKCount[1] >= 1) {
      KaraokeEditor.clearSelection()
      __prevKCount = ['_', 0]

      return
    }

    if (shiftMode && !altMode) KaraokeEditor.clearSelection()
  },

  DeleteSelection: () => {
    var is_it = confirm(
      '정말 선택 된 ' + selectWords.length + '개의 단어를 삭제할까요?'
    )

    if (!is_it) return 0

    selectWords.forEach((details, index) => {
      KaraokeInstance.karaokeData.timeline[details.posX].collection[
        details.posY
      ] = 'MARK_RM'

      if (
        KaraokeInstance.karaokeData.timeline[details.posX].collection.length < 1
      ) {
        KaraokeInstance.karaokeData.timeline = 'MARK_RM'
      }
    })

    KaraokeEditor.removeMarked()
    KaraokeEditor.RenderDOM()
  },

  removeMarked: () => {
    var timeline = KaraokeInstance.karaokeData.timeline
    var timeline_len = timeline.length

    for (var x = 0; x < timeline_len; x++) {
      var cur_x = KaraokeInstance.karaokeData.timeline[x]

      if (typeof cur_x === 'string' && cur_x === 'MARK_RM') {
        KaraokeInstance.karaokeData.timeline.splice(x, 1)
        x--
        continue
      } else if (typeof cur_x === 'object') {
        var y_collec = cur_x.collection
        var y_collec_len = y_collec.length

        for (var y = 0; y < y_collec_len; y++) {
          if (y_collec[y] !== 'MARK_RM') continue

          KaraokeInstance.karaokeData.timeline[x].collection.splice(y, 1)
          y--
        }

        if (KaraokeInstance.karaokeData.timeline[x].collection.length < 1) {
          KaraokeInstance.karaokeData.timeline.splice(x, 1)
          x--
        }
      }
    }
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
      logger.info(0, 'r', 'Karaoke Data Loaded.')
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
