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
 *                    repeat_delay: Time code (ms / 10), // 반복이 있을 경우 해당 텍스트의 반복 딜레이
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

const __cur_line = '__cur_line'
const s__cur_line = ' __cur_line'
const s__cur_line_reg = /\s__cur_line/g

const __currentSync = 'currentSync'
const s__currentSync = ' currentSync'
const s__currentSync_reg = /\scurrentSync/g

const __josenPassing = 'josenPassing'
const s__josenPassing = ' josenPassing'
const s__josenPassing_reg = /\sjosenPassing/g

const c_undefined = 'undefined'
const trs_default = 'all 0.33s ease 0s, color 0.33s ease 0s'

/**
 * a Array에 있는 t 값들을 읽어 최소, 최대 값을 불러옵니다.
 * @param {Array} a 최소값을 읽을 Array
 * @param {String} t Array의 Karaoke 값
 * @param {Number} lh 0: 최소값, 그 외 : 최대 값
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

var __kara_typeList = [null, '__s', 'call', 'cmt', '_cs']
var Karaoke = function (__element) {
  this.karaoke_element = __element
  this.karaokeData = null
  this.SpaParsing = function (spa, spacing) {
    var wordObject = {
      text: spa + (spacing ? ' ' : ''),
      start_time: 0,
      end_time: 0,
      pronunciation_time: 0,
      type: 1
    }

    return wordObject
  }
  this.SetTimelineData = function (data) {
    this.karaokeData = {
      metadata: (this.karaokeData || {}).metadata || {
        correction_time: -10
      },
      timeline: data
    }
    this.RenderDOM()
    this.lineTimingValidate()
  }
  this.CompareArray = (a, b) => {
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
  }
  this.MergeRender = function (prevArray, newArray) {
    var mergedArray = []

    newArray.forEach((newLines, newLineInt) => {
      if (typeof prevArray[newLineInt] === 'undefined') {
        mergedArray.push(newLines)
        return 0
      }

      var comparedDone = false
      ;[prevArray[newLineInt - 1], prevArray[newLineInt + 1]].forEach(
        (comparePrevLine, index) => {
          var sames = this.CompareArray(newLines, comparePrevLine)
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
  }
  this.Render = function (text) {
    var renderedData = []
    text = decodeURI(
      encodeURI(text)
        .replace(/(%0A)/gm, '^L_F')
        .replace(/%20%20/gm, '^S_P')
        .replace(/%20/gm, '^xF')
    )

    var splitLF = text.split('^L_F')
    splitLF.forEach(line => {
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
              this.SpaParsing(spBr, spaSplt.length - 1 > i)
            )
          })
        } else {
          perLineSpacing.collection.push(this.SpaParsing(spa, false))
        }
      })

      perLineSpacing.start_time =
        Number(getLMInArray(perLineSpacing.collection, 'start_time', 0)) / 2
      perLineSpacing.end_time =
        Number(getLMInArray(perLineSpacing.collection, 'end_time', 1)) + 100

      renderedData.push(perLineSpacing)
    })

    return renderedData
  }
  this.selectLine = num => {
    this.karaokeData.timeline[num].collection.forEach((v, i) => {
      for (var o = 0; o < this.__clickFunctions.length; o++) {
        this.__clickFunctions[o](_self, {
          detail: {
            posX: num,
            posY: i,
            _self: document.getElementById(
              this.karaoke_element.id + '_kara_' + num + '_' + i
            )
          }
        })
      }
    })
  }
  this.__clickFunctions = []
  this.ListenClickEvent = function (e) {
    return this.__clickFunctions.push(e)
  }
  this.emitClickEvent = function (element) {
    var posX = element.dataset.line
    var posY = element.dataset.word
    for (var o = 0; o < clf.length; o++) {
      clf[o](_self, { detail: { posX, posY, perElem: element } })
    }
  }
  this.calcRepeats = function (start_time, end_time, delay) {
    var dur = Number(end_time) - Number(start_time)

    if (delay > dur) return ''

    var dMd = Math.floor(dur / delay)
    var rs = []
    for (var i = 1; i <= dMd; i++) {
      rs.push(start_time + i * delay)
    }

    return rs.join(',')
  }
  this.lineTimingValidate = function () {
    this.karaokeData.timeline.forEach(v => {
      v.start_time = Number(getLMInArray(v.collection, 'start_time', 0)) - 100
      v.end_time = Number(getLMInArray(v.collection, 'end_time', 1)) + 100
    })
  }
  this.RenderDOM = function (checkUseRomaji) {
    var inserts = ''
    this.cachedDom = {}

    var t_len = this.karaokeData.timeline.length
    for (var lineI = 0; lineI < t_len; lineI++) {
      var v = this.karaokeData.timeline[lineI].collection
      var spaceEle = ''

      var v_len = v.length

      for (var wordI = 0; wordI < v_len; wordI++) {
        var word = v[wordI]

        if (checkUseRomaji && Aromanize && Number(word.type) != 3) {
          word.text = word.text.romanize()
        }

        var _idx = this.karaoke_element.id + '_kara_' + lineI + '_' + wordI
        spaceEle += `<p class="lyrics ${
          __kara_typeList[word.type]
        }" id="${_idx}" ${word.text.trim() === '' &&
          'llct-blank'} data-line="${lineI}" data-word="${wordI}" ${(typeof word.repeat_delay ===
          'string' ||
          typeof word.repeat_delay === 'number') &&
          (word.repeat_delay != '0' || word.repeat_delay != '') &&
          `data-repeats="${this.calcRepeats(
            word.start_time,
            word.end_time,
            word.repeat_delay
          )}"`} style="text-shadow: ${word.text_color !== null &&
          word.text_color !== '' &&
          '0 0 3px ' + word.text_color};">${
          typeof word.ruby_text !== 'undefined' && word.ruby_text !== ''
            ? '<ruby>' +
              word.text.replace(/\s/g, '&nbsp') +
              '<rt>' +
              word.ruby_text +
              '</rt></ruby>'
            : word.text.replace(/\s/g, '&nbsp')
        }</p>`
      }

      inserts +=
        '<div class="p_line ' +
        (spaceEle.indexOf('llct-blank') > -1 ? 'blank' : '') +
        '" id="' +
        this.karaoke_element.id +
        '_kara_' +
        lineI +
        '"><p class="line_num" data-line="' +
        lineI +
        '">' +
        lineI +
        '.</p> ' +
        spaceEle +
        '</div>'
    }

    this.karaoke_element.innerHTML = inserts

    var lem = document.querySelectorAll(
      '#' + this.karaoke_element.id + ' .line_num'
    )

    for (var i = 0; i < lem.length; i++) {
      ;((_self, clf, perElem) => {
        perElem.addEventListener('click', function () {
          KaraokeInstance.updateLastScroll()
          var posX = Number(perElem.dataset.line)
          var clcA = _self.karaokeData.timeline[posX].collection
          for (var z = 0; z < clcA.length; z++) {
            for (var o = 0; o < clf.length; o++) {
              clf[o](_self, {
                detail: {
                  posX,
                  posY: z,
                  perElem: document.getElementById(
                    _self.karaoke_element.id + '_kara_' + posX + '_' + z
                  )
                }
              })
            }
          }
        })
      })(this, this.__clickFunctions, lem[i])
    }

    var dcg = document.querySelectorAll(
      '#' + this.karaoke_element.id + ' .lyrics'
    )

    for (var i = 0; i < dcg.length; i++) {
      ;((_self, clf, perElem) => {
        perElem.addEventListener('click', function () {
          var posX = Number(perElem.dataset.line)
          var posY = Number(perElem.dataset.word)

          for (var o = 0; o < clf.length; o++) {
            clf[o](_self, { detail: { posX, posY, perElem } })
          }
        })
      })(this, this.__clickFunctions, dcg[i])
    }
  }
  this.clearSync = function (aftFunc) {
    var lyricsElement = document.querySelectorAll(
      '#' + this.karaoke_element.id + ' .lyrics'
    )

    for (var dk = 0; dk < lyricsElement.length; dk++) {
      lyricsElement[dk].className = lyricsElement[dk].className.replace(
        /\scurrentSync/g,
        ''
      )
    }

    if (typeof aftFunc === 'function') {
      aftFunc()
    }
  }
  this.tickSoundEnable = true
  this.tickSoundsCache = {}
  this.toggleTickSounds = function () {
    this.tickSoundEnable = !this.tickSoundEnable
    Sakurauchi.run('tickSoundChanged', this.tickSoundEnable)
  }
  this.cachedDom = {}
  this.__auSync_karaLNum = 0
  this.__last_scroll = 0
  this.updateLastScroll = () => {
    this.__last_scroll = Date.now()
    if (this.__scroll_timeout) {
      clearTimeout(this.__scroll_timeout)
    }
  }
  this.__scroll_timeout = null
  this.NewLineRender = new_line_element => {
    if (this.__scroll_timeout) {
      clearTimeout(this.__scroll_timeout)
    }

    var lyrics_wrap = document.getElementById('lyrics_wrap')

    if (lyrics_wrap) {
      this.__scroll_timeout = setTimeout(() => {
        if (Date.now() - this.__last_scroll < 3000) return
        lyrics_wrap.scrollTop =
          new_line_element.offsetTop -
          (window.innerHeight - lyrics_wrap.getBoundingClientRect().height)
      }, 950)
    }
  }
  this.AudioSync = function (timeCode, fullRender) {
    if (typeof this.karaokeData === 'undefined' || this.karaokeData === null) {
      return 0
    }

    var karaLineNum = this.karaokeData.timeline.length
    while (karaLineNum--) {
      if (typeof this.cachedDom[karaLineNum] === 'undefined') {
        this.cachedDom[karaLineNum] = document.getElementById(
          this.karaoke_element.id + '_kara_' + karaLineNum
        )
      }
      var karaLine = this.karaokeData.timeline[karaLineNum]
      var isNotHighlighting =
        timeCode < karaLine.start_time || timeCode > karaLine.end_time

      if (this.cachedDom[karaLineNum].className.indexOf(__cur_line) > -1) {
        if (isNotHighlighting) {
          this.cachedDom[karaLineNum].className = this.cachedDom[
            karaLineNum
          ].className.replace(s__cur_line_reg, '')
        }
      } else {
        if (!isNotHighlighting) {
          if (!fullRender) this.NewLineRender(this.cachedDom[karaLineNum])
          this.cachedDom[karaLineNum].className += s__cur_line
        }
      }

      if (isNotHighlighting && !fullRender) {
        continue
      }

      var karaWordNum = karaLine.collection.length
      while (karaWordNum--) {
        var karaWord = karaLine.collection[karaWordNum]
        if (karaWord.start_time === 0) continue

        var preBuildID = karaLineNum + '.' + karaWordNum
        if (typeof this.cachedDom[preBuildID] === c_undefined) {
          this.cachedDom[
            karaLineNum + '.' + karaWordNum
          ] = document.getElementById(
            this.karaoke_element.id + '_kara_' + karaLineNum + '_' + karaWordNum
          )
        }

        var kards = this.cachedDom[preBuildID]
        var __josenExists = kards.className.indexOf(__josenPassing) > -1

        if (timeCode > karaWord.start_time && timeCode > karaWord.end_time) {
          if (!__josenExists) {
            kards.className += s__josenPassing
          }
        } else {
          if (__josenExists) {
            kards.className = kards.className.replace(s__josenPassing_reg, '')
          }
        }

        if (kards.dataset.repeats != null) {
          var repeatsSplit = kards.dataset.repeats.split(',')

          for (var g = 0; g < repeatsSplit.length; g++) {
            if (
              timeCode > repeatsSplit[g] - karaWord.repeat_delay * 1.05 &&
              timeCode < repeatsSplit[g] - karaWord.repeat_delay / 3.5 &&
              !this.tickSoundsCache['r_' + repeatsSplit[g]]
            ) {
              logger(
                0,
                'r',
                'runTick @ ' +
                  timeCode +
                  'tc expected ' +
                  repeatsSplit[g] +
                  'tc. ' +
                  (repeatsSplit[g] - timeCode) +
                  'tc diff.',
                'i'
              )
              ;(function (k, kw) {
                k.style.color = 'transparent'
                setTimeout(function () {
                  k.style.color = ''
                }, kw)
              })(kards, karaWord.repeat_delay * 2)

              if (this.tickSoundEnable) {
                Sakurauchi.run('tickSounds', karaWord.tick_volume)
              }

              this.tickSoundsCache['r_' + repeatsSplit[g]] = true
            }
          }
        }

        if (kards.className.indexOf(__currentSync) == -1) {
          kards.className =
            timeCode > karaWord.start_time && timeCode < karaWord.end_time
              ? kards.className + s__currentSync
              : kards.className.replace(s__currentSync_reg, '')

          if (
            this.tickSoundEnable &&
            karaWord.text.trim() !== '*' &&
            timeCode > karaWord.start_time - 5 &&
            timeCode < karaWord.end_time &&
            !this.tickSoundsCache[karaWord.start_time] &&
            karaWord.type == 2
          ) {
            Sakurauchi.run('tickSounds', karaWord.tick_volume)
            this.tickSoundsCache[karaWord.start_time] = true
          }

          if (!kards.style.transition || fullRender) {
            var karaokeDuration =
              typeof karaWord.pronunciation_time === c_undefined ||
              karaWord.pronunciation_time === 0
                ? (((typeof karaLine.collection[karaWordNum + 1] !== c_undefined
                  ? karaLine.collection[karaWordNum + 1].start_time
                  : karaWord.end_time) || 70) -
                    karaWord.start_time) /
                  2
                : karaWord.pronunciation_time

            if (karaokeDuration < 300) karaokeDuration += 30

            if (
              typeof karaLine.collection[karaWordNum - 1] !== c_undefined &&
              karaLine.collection[karaWordNum - 1].start_time ===
                karaLine.collection[karaWordNum].start_time &&
              typeof this.cachedDom[karaLineNum + '.' + (karaWordNum - 1)] !==
                c_undefined
            ) {
              kards.style.transition = this.cachedDom[
                karaLineNum + '.' + (karaWordNum - 1)
              ].style.transition
            } else {
              kards.style.transition =
                'text-shadow, letter-spacing ' +
                karaokeDuration / 300 +
                's ease 0s, color ' +
                karaokeDuration / 300 +
                's ease 0s'
            }
          }
        }

        if (
          (s__currentSync_reg.test(kards.className) &&
            timeCode < karaWord.start_time) ||
          timeCode > karaWord.end_time
        ) {
          kards.className = kards.className.replace(s__currentSync_reg, '')

          if (timeCode > karaWord.end_time) {
            kards.style.transition = trs_default
          }
        }

        kards.style.textDecoration = 'none'
        kards.style.textDecoration = 'blink'
      }
    } // Karaoke Loop
  }
}
