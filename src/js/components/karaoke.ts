import settings from '../core/settings'
import LLCTAudio from '../core/audio'

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

const karaokeClear = () => {
  let words = document.querySelectorAll(KARA_WORD_SELECTOR)

  repeatCaches = {}

  let wordLength = words.length
  while (wordLength--) {
    let word = words[wordLength] as HTMLElement
    word.setAttribute('data-active', '0')
    word.setAttribute('data-passed', '0')
    word.removeAttribute('data-tick')
    word.style.textShadow = null
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
let repeatCaches = {}

/**
 * Karaoke 싱크 렌더링
 * @param time 현재 시간 코드
 * @param root root Element (default: document)
 * @param full_render 전체 렌더링 여부
 * @param newline 새 라인 스크롤 함수
 * @param tick 틱소리 사용 여부
 */
const karaokeRender = (
  time,
  root = document,
  full_render,
  newline: Function,
  tick: Boolean
) => {
  let lines = root.querySelectorAll(KARA_LINE_SELECTOR)

  let lineLength = lines.length
  while (lineLength--) {
    let currentLine = lines[lineLength]

    let line_start = Number(currentLine.getAttribute('data-start'))
    let line_end = Number(currentLine.getAttribute('data-end'))

    if (time < line_start || time > line_end) {
      if (currentLine.getAttribute('data-active') === '1') {
        currentLine.setAttribute('data-active', '0')
      }
    } else if (
      line_start !== -100 &&
      line_end !== 100 &&
      line_end > -1 &&
      (time > line_start || time < line_end)
    ) {
      if (currentLine.getAttribute('data-active') !== '1') {
        currentLine.setAttribute('data-active', '1')
      }

      if (
        typeof newline === 'function' &&
        !karaokeScrollCache[line_start + DOT + line_end]
      ) {
        setTimeout(() => {
          newline(currentLine)
        }, 950)
        karaokeScrollCache[line_start + DOT + line_end] = true
      }
    }
  }

  let words = root.querySelectorAll(
    (full_render ? EMPTY : P_ACTIVE) + KARA_WORD_SELECTOR
  )

  let wordLength = words.length
  while (wordLength--) {
    let currentWord = words[wordLength] as HTMLElement

    let start = Number(currentWord.getAttribute('data-start'))
    let end = Number(currentWord.getAttribute('data-end'))
    let delay = Number(currentWord.getAttribute('data-delay'))

    let start_end = currentWord.getAttribute('word') + DOT + start + DOT + end
    let repeat = repeatCaches[start_end]

    if (!repeat && delay) {
      repeatCaches[start_end] = karaokeCalcRepeat(start, end, delay).split(
        COMMA
      )
    }

    if (time > start && time < end) {
      currentWord.setAttribute('data-active', '1')

      let type = Number(currentWord.getAttribute('data-type'))

      if (repeat) {
        let repeatIter = repeat.length

        while (repeatIter--) {
          if (
            !karaokeTickCache[start_end + DOT + repeat[repeatIter]] &&
            time > repeat[repeatIter]
          ) {
            karaokeTickCache[start_end + DOT + repeat[repeatIter]] = true

            currentWord.setAttribute('data-tick', '1')
            ;(c =>
              setTimeout(() => {
                c.setAttribute('data-tick', '0')
                c.style.transitionDuration = delay / 5 + 'ms'
              }, delay))(currentWord)

            if (tick) {
              karaokeTick.currentTime = 0
              karaokeTick.play(null, true)
            }
          }
        }
      } else if (
        tick &&
        type == 2 &&
        !karaokeTickCache[start_end] &&
        karaokeCheckTick(currentWord.innerText.replace(SPACE_REGEX, EMPTY))
      ) {
        karaokeTickCache[start_end] = true

        karaokeTick.currentTime = 0
        karaokeTick.play(null, true)
      }
    } else {
      currentWord.setAttribute('data-active', '0')
    }

    if (time > end) {
      currentWord.setAttribute('data-passed', '1')

      if (currentWord.style.transitionDuration) {
        currentWord.style.transitionDuration = null
      }
    } else if (
      !currentWord.style.transitionDuration &&
      currentWord.getAttribute('data-passed') == '0' &&
      !repeat
    ) {
      let pron = currentWord.getAttribute('data-pronounce')
      if (pron) {
        currentWord.style.transitionDuration = pron + 's'
      } else {
        let nextWord = words[wordLength + 1] || null
        let nEnd = nextWord
          ? Number(nextWord.getAttribute('data-start')) - start
          : Number(currentWord.parentElement.getAttribute('data-end')) - start

        currentWord.style.transitionDuration =
          (nEnd < 200 ? nEnd + 100 : nEnd + 60) + 'ms'
      }
    }

    let color = currentWord.getAttribute('data-color')
    if (!currentWord.style.textShadow && color) {
      currentWord.style.textShadow = ZZTPIXEL + color
    }
  }
}

const luminance = (r, g, b) => {
  var a = [r, g, b].map(v => {
    v /= 255

    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrast = (rgb1, rgb2) => {
  let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2])
  let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2])

  let brightest = Math.max(lum1, lum2)
  let darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / darkest + 0.05
}

const hexToRGB = hex => {
  let v = hex.indexOf('#') === 0 ? hex.substring(1, hex.length) : hex

  v = v.match(v.length === 3 ? /.{1,1}/g : /.{1,2}/g).map(v => {
    if (v.length === 1) {
      v = v + v
    }

    return parseInt(v, 16)
  })

  return v
}

const padding = v => (v.length === 1 ? '0' + v : v)
const RGBToHex = r => '#' + r.map(v => padding(v.toString(16))).join('')

const parseRGB = str => {
  return str
    .replace(')', '')
    .split('(')[1]
    .split(',')
    .map(v => Number(v.trim()))
}

const inverseColor = c => 255 - c

let latencySleep = 0

export default {
  template: `
    <div class="llct-karaoke">
      <span class="karaoke-notice-wrap" v-slider>
        <span class="karaoke-notice color-notice" v-if="karaColor.text || karaColor.hex">
          <span class="notice-color-layer" :style="{backgroundColor: karaColor.hex}"></span>
          <p class="notice-title">블레이드 추천 색상</p>
          <p class="notice-desc" :style="{color: karaColor.hex && karaColor.hex, textShadow: (lowContrast ? inverse(karaColor.hex) : karaColor.hex && karaColor.hex) + ' 0px 0px ' + (lowContrast ? '6px' : '16px')}">{{karaColor.text}}</p>
        </span>
        <span class="karaoke-notice" v-if="karaData && karaData.metadata && karaData.metadata.singAlong">
          <p class="notice-title">떼창곡</p>
          <p class="notice-desc">노래 가사를 따라 불러주세요.</p>
        </span>
        <span class="karaoke-notice" v-if="karaData && karaData.metadata && karaData.metadata.notPerformed">
          <p class="notice-title">아직 공연한 적 없는 곡</p>
          <p class="notice-desc">제각자 콜이 다를 수 있습니다.</p>
        </span>
      </span>
      <span v-if="!error && (!karaImage && !useImage)" v-for="(line, lineIndex) in karaData.timeline" class="karaoke-line-wrap" :key="'line_' + lineIndex">
        <p class="karaoke-line" :data-line="lineIndex" :data-start="line.start_time" :data-end="line.end_time">
          <span class="karaoke-word" v-for="(word, wordIndex) in line.collection" :key="'word_' + word.text + word.start_time + '.' + Math.random()" v-on:click="jump" data-active="0" data-passed="0" :data-color="word.text_color" :data-delay="word.repeat_delay" :data-pronounce="word.pronunciation_time || false" :data-word="wordIndex" :data-type="word.type" :data-start="word.start_time" :data-end="word.end_time" :class="{empty: word.text == '' }"><em v-if="word.ruby_text">{{word.ruby_text}}</em>{{word.text.replace(/\ /gi, '&nbsp;')}}</span>
        </p>
        <p class="karaoke-lyrics" v-if="showLyrics && line.lyrics && line.lyrics.length > 0">{{line.lyrics}}</p>
      </span>
      <span v-if="(karaImage || useImage) && !error">
        <img class="karaoke-image" :src="karaImage" v-on:error="imgHandler"></img>
      </span>
      <div class="error" v-if="error">
        <p>콜표를 불러올 수 없습니다. {{error.message ? '- ' + error.message : ''}}</p>
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
      karaImage: null,
      karaColor: null,
      lowContrast: false
    }
  },
  computed: {
    showLyrics () {
      return settings.get('useLyrics') || false
    },

    useImage () {
      return settings.get('useImageInstead') || false
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
        let tCode = window.audio.timecode()
        this.lastTime = v

        if (this.lastTime && Math.abs(this.lastTime - v) > 3) {
          karaokeRender(tCode, this.$el, true, this.scrollSong, this.tickEnable)
          return
        }

        let perf = performance.now()
        karaokeRender(tCode, this.$el, false, this.scrollSong, this.tickEnable)

        if (latencySleep < perf) {
          this.$parent.renderLatency = (performance.now() - perf).toFixed(2)

          latencySleep = performance.now() + 100
        }
      }
    }
  },
  methods: {
    inverse (c) {
      return RGBToHex(hexToRGB(c).map(v => inverseColor(v)))
    },

    calculateColor (color) {
      let q = this.$el.querySelector('.color-notice')

      if (!q) {
        return
      }

      let parent = parseRGB(
        window.getComputedStyle(q, null).backgroundColor || 'rgb(255, 255, 255)'
      )

      let rgb = hexToRGB(color.hex)
      this.lowContrast = contrast(parent, rgb) < 1.5
    },

    load () {
      this.error = null
      karaokeClear()

      let request = this.$llctDatas.karaoke(
        this.id,
        settings.get('useImageInstead')
      )

      this.karaColor = request.color

      requestAnimationFrame(() => {
        this.calculateColor(this.karaColor)
      })

      this.karaData = { metadata: {}, timeline: [] }
      this.karaImage = null

      if (request.lyricsType === 'img') {
        this.karaImage = this.$llctDatas.base + '/call/' + this.id + '?img=true'
      } else {
        request.lyricsType
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

      window.addEventListener('focus', () => {
        if (!this.error) {
          karaokeRender(
            window.audio.timecode(),
            this.$el,
            true,
            null,
            this.tickEnable
          )
        }
      })
    },

    scrollTop (pos) {
      this.$el.scrollTop = pos
    },

    reRender () {
      karaokeClear()
      karaokeRender(
        window.audio.timecode(),
        this.$el,
        true,
        null,
        this.tickEnable
      )
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

      window.audio.time = (Number(ev.target.dataset.start) - 10) / 100

      this.reRender()
    },

    imgHandler (ev) {
      ev.message = '이미지 로드 실패.'
      this.error = ev
    }
  },
  mounted () {
    if (!karaokeTick) {
      karaokeTick = new LLCTAudio(true, true, false)
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
}
