const KARA_WORD_SELECTOR = 'span.karaoke-word'
const KARA_LINE_SELECTOR = '.karaoke-line'
const P_ACTIVE = 'p[data-active="1"] '

const DOT = '.'
const COMMA = ','
const EMPTY = ''

const ZZTPIXEL = '0px 0px 3px '

const AEST = '*'
const LEFT_BRACKET = '('

const SPACE_REGEX = /\s/g

const karaokeCalcRepeat = (start, end, repeat) => {
  let m = end - start
  let x = Math.round(m / repeat)

  if (x < 1) {
    return EMPTY
  }

  let f = EMPTY
  for (var i = 1; i < x; i++) {
    f += start + repeat * i + (i + 1 != x ? COMMA : EMPTY)
  }
  return f
}

const karaokeClear = root => {
  let words = (root || document).querySelectorAll(KARA_WORD_SELECTOR)

  let wordLength = words.length
  while (wordLength--) {
    words[wordLength].dataset.active = 0
    words[wordLength].dataset.passed = 0
    delete words[wordLength].dataset.tick
    words[wordLength].style.textShadow = null
  }

  karaokeTickCache = []
  karaokeScrollCache = []
}

const karaokeCheckTick = t => {
  return t !== AEST && t !== LEFT_BRACKET
}

let karaokeTick = null
let karaokeTickCache = []
let karaokeScrollCache = []

let lastPlayed = 1000000

/**
 * Karaoke 싱크 렌더링
 * @param {Number} time 현재 시간 코드
 * @param {HTMLElement} root root Element (default: document)
 * @param {Boolean} full 전체 렌더링 여부
 * @param {Function} newline 새 라인 스크롤 함수
 * @param {Boolean} tick 틱소리 사용 여부
 */
const karaokeRender = (time, root = document, full, newline, tick) => {
  let lines = root.querySelectorAll(KARA_LINE_SELECTOR)

  let lineLength = lines.length
  while (lineLength--) {
    let currentLine = lines[lineLength]
    let line_dset = currentLine.dataset

    let lineStart = Number(line_dset.start)
    let lineEnd = Number(line_dset.end)

    if (time < lineStart || time > lineEnd) {
      if (line_dset.active && !currentLine.dataset.active) {
        currentLine.dataset.active = 0
      }
    } else if (
      lineStart !== -100 &&
      lineEnd !== 100 &&
      lineEnd > -1 &&
      (time > lineStart || time < lineEnd)
    ) {
      if (!currentLine.dataset.active) {
        currentLine.dataset.active = 1
      }

      let start_dot_end = line_dset.start + DOT + line_dset.end
      if (typeof newline === 'function' && !karaokeScrollCache[start_dot_end]) {
        setTimeout(() => {
          newline(currentLine)
        }, 950)
        karaokeScrollCache[start_dot_end] = true
      }
    }
  }

  let words = root.querySelectorAll(
    (full ? EMPTY : P_ACTIVE) + KARA_WORD_SELECTOR
  )

  let wordLength = words.length
  while (wordLength--) {
    let currentWord = words[wordLength]

    let dset = currentWord.dataset
    let start = Number(dset.start)
    let end = Number(dset.end)
    let type = Number(dset.type)
    let delay = Number(dset.delay)

    let start_end = start + DOT + end

    if (!Number.isNaN(delay) && !dset.repeat && delay > 0) {
      dset.repeat = karaokeCalcRepeat(start, end, Number(delay))
    }

    if (time > start && time < end) {
      if (dset.repeat) {
        let repeat = dset.repeat.split(COMMA)
        let repeatIter = repeat.length

        while (repeatIter--) {
          let start_end_repeat = start_end + DOT + repeat[repeatIter]

          if (
            !karaokeTickCache[start_end_repeat] &&
            time > Number(repeat[repeatIter])
          ) {
            karaokeTickCache[start_end_repeat] = true

            currentWord.dataset.tick = 1
            ;(c => {
              setTimeout(() => {
                c.dataset.tick = 0
              }, delay * 0.5)
            })(currentWord)

            if (tick) {
              requestAnimationFrame(() => {
                karaokeTick.currentTime = 0
                karaokeTick.play(null, true)
              })
            }
          }
        }
      } else if (
        tick &&
        type == 2 &&
        !karaokeTickCache[start_end] &&
        karaokeCheckTick(currentWord.innerText.replace(SPACE_REGEX, EMPTY))
      ) {
        lastPlayed = time
        karaokeTickCache[start_end] = true

        karaokeTick.currentTime = 0
        karaokeTick.play(null, true)
      }

      currentWord.dataset.active = 1
    } else {
      currentWord.dataset.active = 0
    }

    if (time > end) {
      currentWord.dataset.passed = 1

      if (currentWord.style.transitionDuration) {
        currentWord.style.transitionDuration = null
      }
    } else if (
      !currentWord.style.transitionDuration &&
      dset.passed == 0 &&
      !dset.repeat
    ) {
      if (dset.pronounce) {
        currentWord.style.transitionDuration = dset.pronounce + 's'
      } else {
        let nextWord = words[wordLength + 1] || null
        let nEnd = nextWord
          ? nextWord.dataset.start - start
          : currentWord.parentElement.dataset.end - start

        let calc = nEnd < 300 ? nEnd + 330 : nEnd + 200

        currentWord.style.transitionDuration = calc + 'ms'
      }
    }

    if (!currentWord.style.textShadow && dset.color) {
      currentWord.style.textShadow = ZZTPIXEL + dset.color
    }
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
        <p>콜표를 불러올 수 없습니다. - {{error.message}}</p>
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
      return LLCTSettings.get('useLyrics') || false
    },

    useImage () {
      return LLCTSettings.get('useImageInstead') || false
    }
  },
  watch: {
    id: {
      immediate: true,
      handler () {
        this.load()
      }
    },
    time: {
      handler (v) {
        let tCode = audio.timecode()
        this.lastTime = v

        if (this.lastTime && Math.abs(this.lastTime - v) > 3) {
          karaokeRender(tCode, this.$el, true, this.scrollSong, this.tickEnable)
          return
        }

        karaokeRender(tCode, this.$el, false, this.scrollSong, this.tickEnable)
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
              karaokeRender(0, this.$el, true, null, this.tickEnable)
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

    reRender () {
      karaokeClear()
      karaokeRender(audio.timecode(), this.$el, true, null, this.tickEnable)
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

      this.reRender()
    },

    imgHandler (ev) {
      ev.message = '이미지 로드 실패.'
      this.error = ev
    }
  },
  mounted () {
    if (!karaokeTick) {
      karaokeTick = new LLCTAudio(true, true)
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

    this.$llctEvents.$on('karaokeUpdate', this.reRender)
  },
  updated () {
    this.scrollTop(0)
  }
})
