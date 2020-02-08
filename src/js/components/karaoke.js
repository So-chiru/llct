const karaokeCalcRepeat = (start, end, repeat) => {
  let f = ''
  let m = end - start
  let x = Math.round(m / repeat)

  if (x < 1) {
    return ''
  }

  for (var i = 1; i < x; i++) {
    f += start + repeat * i + (i + 1 != x ? ',' : '')
  }

  return f
}

const karaokeClear = root => {
  let words = (root || document).querySelectorAll('span.karaoke-word')

  let wordLength = words.length
  while (wordLength--) {
    words[wordLength].dataset.active = '0'
    words[wordLength].dataset.passed = '0'
    delete words[wordLength].dataset.tick
    words[wordLength].style.textShadow = null
  }

  karaokeTickCache = []
  karaokeScrollCache = []
}

const karaokeCheckTick = (type, text) => {
  return type == 2 && text != '*' && text != '('
}

let karaokeExpo = t => {
  return -Math.pow(2, (-10 * t) / 1000) + 1
}

let karaokeTick = null
let karaokeTickCache = []
let karaokeScrollCache = []

/**
 * Karaoke 싱크 렌더링
 * @param {Number} time 현재 시간 코드
 * @param {HTMLElement} root root Element (default: document)
 * @param {Number} offset 시간 offset
 * @param {Boolean} full 전체 렌더링 여부
 * @param {Function} newline 새 라인 스크롤 함수
 */
const karaokeRender = (time, root, offset, full, newline, tick) => {
  let lines = (root || document).querySelectorAll('.karaoke-line')

  let lineLength = lines.length

  while (lineLength--) {
    let currentLine = lines[lineLength]

    let lineStart = Number(currentLine.dataset.start)
    let lineEnd = Number(currentLine.dataset.end)

    if (time < lineStart - offset || time > lineEnd + offset) {
      // 현 시간이 시작 시간 - offset 보다 작거나, 현재 시간이 끝 시간 + offset 보다 큰 경우

      if (currentLine.dataset.active) {
        currentLine.dataset.active = '0'
      }
    } else if (
      lineEnd !== 100 &&
      lineEnd > -1 &&
      (time > lineStart || time < lineEnd)
    ) {
      currentLine.dataset.active = '1'
      if (
        newline &&
        !karaokeScrollCache[
          currentLine.dataset.start + '.' + currentLine.dataset.end
        ]
      ) {
        setTimeout(() => {
          newline(currentLine)
        }, 950)
        karaokeScrollCache[
          currentLine.dataset.start + '.' + currentLine.dataset.end
        ] = true
      }
    }
  }

  let words = (root || document).querySelectorAll(
    (full ? '' : 'p[data-active="1"]') + ' span.karaoke-word'
  )

  let wordLength = words.length

  while (wordLength--) {
    let currentWord = words[wordLength]
    let nextWord = words[wordLength + 1] || null

    let start = Number(currentWord.dataset.start)
    let end = Number(currentWord.dataset.end)
    let type = Number(currentWord.dataset.type)
    let delay = Number(currentWord.dataset.delay)

    if (
      !Number.isNaN(delay) &&
      !currentWord.dataset.repeat &&
      Number(delay) > 0
    ) {
      currentWord.dataset.repeat = karaokeCalcRepeat(start, end, Number(delay))
    }

    if (time > start && time < end) {
      if (
        tick &&
        !karaokeTickCache[start + '.' + end] &&
        karaokeCheckTick(type, currentWord.innerText.trim())
      ) {
        karaokeTickCache[start + '.' + end] = true

        karaokeTick.time = 0
        karaokeTick.play()
      }

      if (currentWord.dataset.repeat) {
        let repeat = currentWord.dataset.repeat.split(',')
        let repeatIter = repeat.length

        while (repeatIter--) {
          if (
            !karaokeTickCache[start + '.' + end + '.' + repeat[repeatIter]] &&
            time > Number(repeat[repeatIter])
          ) {
            karaokeTickCache[
              start + '.' + end + '.' + repeat[repeatIter]
            ] = true

            currentWord.dataset.tick = '1'
            ;(c => {
              setTimeout(() => {
                c.dataset.tick = '0'
              }, delay * 0.9)
            })(currentWord)

            karaokeTick.time = 0
            karaokeTick.play()
          }
        }

        repeat = undefined
        repeatIter = undefined
      }

      // 현 시간이 시작 시간 보다 크거나, 현재 시간이 끝 시간 보다 작은 경우 (싱크 속함)

      currentWord.dataset.active = '1'
    } else {
      currentWord.dataset.active = '0'
    }

    if (
      !currentWord.style.transitionDuration &&
      currentWord.dataset.passed == '0'
    ) {
      if (currentWord.dataset.pronounce) {
        currentWord.style.transitionDuration =
          currentWord.dataset.pronounce + 's'
      } else {
        let nEnd = nextWord
          ? nextWord.dataset.start - start
          : currentWord.parentElement.dataset.end - start

        let calc = nEnd < 300 ? nEnd + 270 : nEnd

        currentWord.style.transitionDuration = calc + 'ms'
      }
    }

    if (!currentWord.style.textShadow && currentWord.dataset.color) {
      currentWord.style.textShadow = `0px 0px 3px ${currentWord.dataset.color}`
    }

    if (time > end) {
      currentWord.dataset.passed = '1'
      currentWord.style.transitionDuration = null
    }

    currentWord = undefined
  }
}

let karaokeFrame = null
let karaokeFocusDetect = null

Vue.component('llct-karaoke', {
  template: `
    <div class="llct-karaoke">
      <span v-if="!error && (!karaImage && !useImage)" v-for="(line, lineIndex) in karaData.timeline" class="karaoke-line-wrap" :key="'line_' + lineIndex">
        <p class="karaoke-line" :data-line="lineIndex" :data-start="line.start_time" :data-end="line.end_time">
          <span class="karaoke-word" v-for="(word, wordIndex) in line.collection" :key="word.text + word.start_time" v-on:click="jump" data-active="0" data-passed="0" :data-color="word.text_color" :data-delay="word.repeat_delay" :data-pronounce="word.pronunciation_time || false" :data-word="wordIndex" :data-type="word.type" :data-start="word.start_time" :data-end="word.end_time" :class="{empty: word.text == '' }"><em v-if="word.ruby_text">{{word.ruby_text}}</em>{{word.text.replace(/\ /gi, '&nbsp;')}}</span>
        </p>
        <p class="karaoke-lyrics" v-if="showLyrics && line.lyrics && line.lyrics.length > 0">{{line.lyrics}}</p>
      </span>
      <span v-if="(karaImage || useImage) && !error">
        <img class="karaoke-image" :src="karaImage" v-on:error="imgHandler"></img>
      </span>
      <div class="error" v-if="error">
        <h3>아악!</h3>
        <p>콜표를 불러올 수 없습니다. (미 등록 혹은 연결 오류) - {{error.message}}</p>
      </div>
    </div>
  `,
  props: {
    id: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: false
    },
    playing: {
      type: Boolean,
      required: true
    },
    show: {
      type: Boolean,
      required: false
    },
    autoScroll: {
      type: Boolean,
      required: false
    },
    updateKaraoke: {
      type: [String, Number],
      required: false
    },
    tickEnable: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      karaData: { metadata: {}, timeline: [] },
      error: null,
      needClear: false,
      lastScroll: 0,
      karaImage: null
    }
  },
  computed: {
    showLyrics () {
      return LLCTSettings.get('useLyrics')
    },

    useImage () {
      return LLCTSettings.get('useImageInstead')
    }
  },
  watch: {
    id: {
      deep: true,
      immediate: true,
      handler () {
        this.load()
      }
    },
    time: {
      deep: true,
      handler (v) {
        if (this.lastTime && Math.abs(this.lastTime - v) > 3) {
          karaokeRender(
            audio.timecode(),
            this.$el,
            5,
            true,
            this.scrollSong,
            this.tickEnable
          )

          this.lastTime = v

          return
        }

        karaokeRender(
          audio.timecode(),
          this.$el,
          5,
          false,
          this.scrollSong,
          this.tickEnable
        )

        this.lastTime = v
      }
    },
    playing: {
      deep: true,
      handler () {
        if (this.needClear) {
          karaokeClear()
        }

        if (!this.playing && audio.currentTime() == audio.duration()) {
          this.needClear = true
        }
      }
    },
    updateKaraoke: {
      deep: true,
      handler () {
        karaokeClear()
        karaokeRender(
          audio.timecode(),
          this.$el,
          5,
          true,
          null,
          this.tickEnable
        )
      }
    }
  },
  methods: {
    load () {
      this.error = null
      karaokeClear()

      let request = this.$llctDatas.karaoke(
        this.id,
        LLCTSettings.get('useImageInstead')
      )

      if (request === 'img') {
        this.karaImage = this.$llctDatas.base + '/call/' + this.id + '?img=true'
      } else {
        this.karaImage = null

        request
          .then(data => {
            this.karaData = data

            setTimeout(() => {
              karaokeRender(0, this.$el, 0, true, null, this.tickEnable)
            }, 0)
          })
          .catch(e => {
            this.error = e
          })
      }

      if (!karaokeFocusDetect) {
        karaokeFocusDetect = window.addEventListener('focus', () => {
          if (!this.error) {
            karaokeRender(
              audio.timecode(),
              this.$el,
              5,
              true,
              null,
              this.tickEnable
            )
          }
        })
      }
    },

    scrollTop (pos) {
      this.$el.scrollTop = pos
    },

    scrollSong (el) {
      if (this.lastScroll + 3000 > Date.now()) return true

      let thisBound = this.$el.getBoundingClientRect().height
      let offset = el.parentNode.offsetTop

      this.scrollTop(
        offset - (thisBound - (window.screen.height - thisBound) / 2) / 2
      )
    },

    scrollToElem (el) {
      let thisBound = this.$el.getBoundingClientRect().height
      let offset = el.parentNode.parentNode.offsetTop

      this.scrollTop(
        offset - (thisBound - (window.screen.height - thisBound) / 2) / 2
      )
    },

    jump (ev) {
      if (!ev.target || !this.$parent.usePlayer) {
        return false
      }

      audio.time = (Number(ev.target.dataset.start) - 10) / 100

      karaokeClear()
      karaokeRender(audio.timecode(), this.$el, 5, true, null, this.tickEnable)
    },

    imgHandler(ev) {
      ev.message = 'Failed to load call image.'
      this.error = ev
    }
  },
  mounted () {
    if (!karaokeTick) {
      karaokeTick = new LLCTAudio(true)
      karaokeTick.load('/assets/tick.mp3')
      karaokeTick.volume = 1
    }

    this.$el.addEventListener(
      'scroll',
      () => {
        this.lastScroll = Date.now()
      },
      false
    )
  },
  updated () {
    this.scrollTop(0)
  }
})
