/* global karaokeData, $, CustomEvent, chillout */
/*
 * Karaoke Module
 *
 *  Object (JSON) -> {
 *    metadata: Object (메타데이터) -> {
 *        lyrics: String, // 가사 전문
 *        correction_time: Time code, // 보정 시간
 *        lastedit: Time code (audio.currentTime() * 100), // 마지막으로 수정 한 타임 코드 (에디터 사용)
 *    },
 *    timeline: Array -> [
 *        [Object] (가사 한 줄) -> {
 *            start_time: Time code (audio.currentTime() * 100), // 렌더링 시작 시간
 *            end_time: Time code (audio.currentTime() * 100), // 렌더링 끝나는 시간
 *            collection: [Array] (가사 음 Collection) -> [
 *                [Object] (가사 음) -> {
 *                    text: String, // 들어갈 내용
 *                    start_time: Time code (audio.currentTime() * 100), // 시작 시간
 *                    end_time: Time code (audio.currentTime() * 100), // 끝나는 시간
 *                    pronunciation_time: Time code (ms / 10), // 발음 시간
 *                    type: Number (1~3) // 1: 가사, 2: 콜, 3: comment, 4: 콜 + 가사
 *                } ...
 *            ]
 *        } ...
 *     ]
 *  }
 *
 * 가사 한 줄 마다 : line break;
 * 가사 음 마다 : NONE;
 */

const getLMInArray = (a, t, lh) => {
  var _mx = lh === 0 ? 999999999 : 0
  for (var i = 0; i < a.length; i++) {
    if (lh === 0) {
      _mx = Number(a[i][t]) < _mx ? a[i][t] : _mx
      continue
    }

    _mx = Number(a[i][t]) > _mx ? a[i][t] : _mx
  }

  return _mx
}

var Karaoke = {
  TypeLists: [null, '__s', 'call', 'cmt', '_cs'],
  SpaParsing: function (spa, spacing) {
    var wordObject = {
      text: spa + (spacing ? ' ' : ''),
      start_time: 0,
      end_time: 0,
      pronunciation_time: 0,
      type: 1
    }

    return wordObject
  },

  SetTimelineData: function (data) {
    window.karaokeData.timeline = data
    Karaoke.RenderDOM()
    Karaoke.startEndOpti()
  },

  SelectWord: function (posX, posY, element) {
    Sakurauchi.run('KaraokeSelection', { detail: { posX, posY, element } })
  },

  CompareArray: (a, b) => {
    if (
      typeof a === 'undefined' ||
      typeof b === 'undefined' ||
      typeof a !== typeof b
    ) {
      return false
    }

    // if (a.start_time !== b.start_time) return false
    // if (a.end_time !== b.end_time) return false
    if (a.collection.length !== b.collection.length) return false

    var diff = false
    a.collection.forEach((v, i) => {
      diff =
        v.text !== b.collection[i].text ||
        v.type !== b.collection[i].type ||
        v.start_time !== b.collection[i].start_time ||
        v.end_time !== b.collection[i].end_time ||
        v.pronunciation_time !== b.collection[i].pronunciation_time
    })

    return !diff
  },

  MergeRender: function (prevArray, newArray) {
    var mergedArray = []

    newArray.forEach((newLines, newLineInt) => {
      if (typeof prevArray[newLineInt] === 'undefined') {
        mergedArray.push(newLines)
        return 0
      }

      var comparedDone = false
      ;[prevArray[newLineInt - 1], prevArray[newLineInt + 1]].forEach(
        (comparePrevLine, index) => {
          var sames = Karaoke.CompareArray(newLines, comparePrevLine)
          if (!sames) return 0

          mergedArray.push(comparePrevLine)
          comparedDone = true
        }
      )
      if (comparedDone) return 0

      var lineObj = {
        start_time: 0,
        end_time: 0,
        collection: []
      }

      newLines.collection.forEach((newWords, newWordsInt) => {
        if (
          typeof prevArray[newLineInt].collection[newWordsInt] ===
            'undefined' ||
          newWords.text !== prevArray[newLineInt].collection[newWordsInt].text
        ) {
          lineObj.collection.push(newWords)
          return 0
        }

        lineObj.collection.push(prevArray[newLineInt].collection[newWordsInt])
      })

      mergedArray.push(lineObj)
    })

    return mergedArray
  },

  Render: function (text) {
    var renderedData = []
    text = decodeURI(
      encodeURI(text)
        .replace(/(%0A)/gm, '^L_F')
        .replace(/%20%20/gm, '^S_P')
        .replace(/%20/gm, '^xF')
    )

    var splitLF = text.split('^L_F')
    splitLF.forEach((line, lineIndex) => {
      var perLineSpacing = {
        start_time: 0,
        end_time: 0,
        collection: []
      }

      line.split('^xF').forEach((spa, index) => {
        if (/\^S_P/g.test(spa)) {
          var spaSplt = spa.split(/\^S_P/g)
          spaSplt.forEach((spBr, i) => {
            perLineSpacing.collection.push(
              Karaoke.SpaParsing(spBr, spaSplt.length - 1 > i)
            )
          })
        } else {
          perLineSpacing.collection.push(Karaoke.SpaParsing(spa, false))
        }
      })

      perLineSpacing.start_time =
        Number(getLMInArray(perLineSpacing.collection, 'start_time', 0)) / 2
      perLineSpacing.end_time =
        Number(getLMInArray(perLineSpacing.collection, 'end_time', 1)) + 100

      renderedData.push(perLineSpacing)
    })

    return renderedData
  },

  selectLine: num => {
    karaokeData.timeline[num].collection.forEach((v, i) => {
      Karaoke.SelectWord(
        num,
        i,
        document.getElementById('kara_' + num + '_' + i)
      )
    })
  },

  startEndOpti: function () {
    karaokeData.timeline.forEach((value, index) => {
      value.start_time =
        Number(getLMInArray(value.collection, 'start_time', 0)) - 100
      value.end_time =
        Number(getLMInArray(value.collection, 'end_time', 1)) + 100
    })
  },

  RenderDOM: function () {
    var inserts = ''
    Karaoke.cachedDom = {}
    karaokeData.timeline.forEach((v, lineI) => {
      var spaceEle = ''
      v.collection.forEach((word, wordI) => {
        spaceEle +=
          '<p class="lyrics ' +
          Karaoke.TypeLists[word.type] +
          '" id="kara_' +
          lineI +
          '_' +
          wordI +
          '" style="text-shadow: ' +
          (word.text_color !== null && word.text_color !== ''
            ? '0 0 5px ' + word.text_color
            : '') +
          ';" onclick="Karaoke.SelectWord(' +
          lineI +
          ', ' +
          wordI +
          ', this)">' +
          (typeof word.ruby_text !== 'undefined' && word.ruby_text !== ''
            ? '<ruby>' +
              word.text.replace(/\s/g, '&nbsp') +
              '<rt>' +
              word.ruby_text +
              '</rt></ruby>'
            : word.text.replace(/\s/g, '&nbsp')) +
          '</p>'
      })
      inserts +=
        '<div class="p_line" id="kara_' +
        lineI +
        '"><p class="line_num" onclick="Karaoke.selectLine(' +
        lineI +
        ')">' +
        lineI +
        '.</p> ' +
        spaceEle +
        '</div>'
    })

    document.getElementById('karaoke').innerHTML = inserts
  },

  clearSync: function (aftFunc) {
    var lyricsElement = document.getElementsByClassName('.lyrics')

    for (var dk = 0; dk < lyricsElement.length; dk++) {
      lyricsElement[dk].className = lyricsElement[dk].className.replace(
        /\scurrentSync/g,
        ''
      )
    }

    if (typeof aftFunc === 'function') {
      aftFunc()
    }
  },

  tickSoundEnable: true,
  tickSoundsCache: {},
  toggleTickSounds: function () {
    Karaoke.tickSoundEnable = !Karaoke.tickSoundEnable
    Sakurauchi.run('tickSoundChanged', Karaoke.tickSoundEnable)
  },
  cachedDom: {},
  AudioSync: function (timeCode, fullRender) {
    if (karaokeData === 'undefined' || karaokeData === null) return 0
    for (
      var karaLineNum = 0;
      karaLineNum < karaokeData.timeline.length;
      karaLineNum++
    ) {
      if (typeof Karaoke.cachedDom[karaLineNum] === 'undefined') {
        Karaoke.cachedDom[karaLineNum] = document.getElementById(
          'kara_' + karaLineNum
        )
      }
      var karaLine = karaokeData.timeline[karaLineNum]
      var isNotHighlighting =
        timeCode < karaLine.start_time || timeCode > karaLine.end_time

      if (
        isNotHighlighting &&
        /__cur_line/g.test(Karaoke.cachedDom[karaLineNum].className)
      ) {
        Karaoke.cachedDom[karaLineNum].className = Karaoke.cachedDom[
          karaLineNum
        ].className.replace(/\s__cur_line/, '')
      }

      if (!isNotHighlighting) {
        Karaoke.cachedDom[karaLineNum].classList += ' __cur_line'
      }

      if (
        (timeCode < karaLine.start_time || timeCode > karaLine.end_time) &&
        !fullRender
      ) {
        continue
      }

      for (
        var karaWordNum = 0;
        karaWordNum < karaLine.collection.length;
        karaWordNum++
      ) {
        var karaWord = karaLine.collection[karaWordNum]
        if (karaWord.start_time === 0 || karaWord.start_time === '0') continue
        karaWord.start_time = Number(karaWord.start_time)
        karaWord.end_time = Number(karaWord.end_time)

        if (
          typeof Karaoke.cachedDom[karaLineNum + '.' + karaWordNum] ===
          'undefined'
        ) {
          Karaoke.cachedDom[
            karaLineNum + '.' + karaWordNum
          ] = document.getElementById('kara_' + karaLineNum + '_' + karaWordNum)
        }
        var kards = Karaoke.cachedDom[karaLineNum + '.' + karaWordNum]

        var isCurWord =
          timeCode > karaWord.start_time && timeCode > karaWord.end_time
        var __josenExists = /josenPassing/g.test(kards.className)
        if (!isCurWord && __josenExists) {
          kards.className = kards.className.replace(/\sjosenPassing/, '')
        }

        if (isCurWord && !__josenExists) {
          kards.className += ' josenPassing'
        }

        if (!/currentSync/g.test(kards.className)) {
          kards.className =
            timeCode > karaWord.start_time && timeCode < karaWord.end_time
              ? kards.className + ' currentSync'
              : kards.className.replace(/\scurrentSync/g, '')

          if (
            Karaoke.tickSoundEnable &&
            timeCode > karaWord.start_time - 5 &&
            timeCode < karaWord.end_time &&
            !Karaoke.tickSoundsCache[karaWord.start_time] &&
            karaWord.type == 2
          ) {
            Sakurauchi.run('tickSounds')
            Karaoke.tickSoundsCache[karaWord.start_time] = true
          }

          if (!kards.style.transition || fullRender) {
            var karaokeDuration =
              typeof karaWord.pronunciation_time === 'undefined' ||
              karaWord.pronunciation_time === 0
                ? (((typeof karaLine.collection[karaWordNum + 1] !== 'undefined'
                  ? karaLine.collection[karaWordNum + 1].start_time
                  : karaWord.end_time) || 70) -
                    karaWord.start_time) /
                  2
                : karaWord.pronunciation_time

            if (karaokeDuration < 300) karaokeDuration += 30

            if (
              typeof karaLine.collection[karaWordNum - 1] !== 'undefined' &&
              karaLine.collection[karaWordNum - 1].start_time ===
                karaLine.collection[karaWordNum].start_time
            ) {
              kards.style.transition =
                Karaoke.cachedDom[
                  karaLineNum + '.' + (karaWordNum - 1)
                ].style.transition
            } else {
              kards.style.transition =
                'text-shadow ' +
                karaokeDuration / 300 +
                's ease 0s, color ' +
                karaokeDuration / 300 +
                's ease 0s'
            }
          }
        }

        if (
          (/\scurrentSync/g.test(kards.className) &&
            timeCode < karaWord.start_time) ||
          timeCode > karaWord.end_time
        ) {
          kards.className = kards.className.replace(/currentSync/g, '')

          if (timeCode > karaWord.end_time) {
            kards.style.transition =
              'text-shadow 0.33s ease 0s, color 0.33s ease 0s'
          }
        }

        kards.style.textDecoration = 'none'
        kards.style.textDecoration = 'blink'
      }
    }
  }
}

window.Karaoke = Karaoke
