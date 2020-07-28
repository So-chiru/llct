const draggable = require('vuedraggable')

import LLCTCheckbox from '../checkbox'
import LLCTKaraoke from '../karaoke'

import { LLCTRepeatState } from '../../store/modules/player'

import { show } from '../modal'

import settings from '../../core/settings'

const timeStamp = num => {
  return new Date((num || 0) * 1000).toISOString().substr(14, 5)
}

export default {
  components: {
    draggable,
    LLCTCheckbox,
    LLCTKaraoke
  },
  template: `<div class="llct-tab llct-tab-over" id="tab4">
    <div class="llct-player">
      <div class="player-dash" v-show="title !== null">
        <div class="player-left">
          <div class="player-info">
            <div class="player-info-image">
              <img :src="url"></img>
            </div>
            <div class="player-info-text">
              <p class="player-song-title" :title="title">{{preferTitle}}</p>
              <p class="player-song-artist" :title="artist">{{artist}}</p>
            </div>
          </div>
          <div class="player-progress">
            <div class="player-progress-inner" v-if="usePlayer" :data-phase="phase">
              <div class="current">{{time_went}}</div>
              <div class="bar" v-on:click="thumbProgress">
                <div class="bar-thumb" :style="{transform: 'translateX(calc((' + bar_size + 'px *' + progress + ') - 8px))'}" v-on:dragstart="thumbProgress" v-on:drag="thumbProgress" draggable="true"></div>
                <div class="bar-current" :style="{transform: 'scaleX(' + progress + ')'}" v-if="playable && !audio.loading"></div>
                <div class="bar-load" :style="{width: load_progress + '%'}" v-else></div>
                <div class="bar-bg"></div>
              </div>
              <div class="left">-{{time_left}}</div>
            </div>
          </div>
          <div class="player-btn">
            <i v-if="usePlayer" class="material-icons" tabindex="5" v-show="!playing && !this.$store.state.player.play.autoplay" v-on:click="play" v-on:keypress="ev => ev.keyCode == '13' && play()" alt="재생 버튼">play_arrow</i>
            <i v-if="usePlayer" class="material-icons" tabindex="6" v-show="playing || this.$store.state.player.play.autoplay" v-on:click="pause" v-on:keypress="ev => ev.keyCode == '13' && pause()" alt="일시정지 버튼">pause</i>
            <i v-if="usePlayer" class="material-icons" tabindex="7" v-show="this.$store.state.player.playlist" v-on:click="next" v-on:keypress="ev => ev.keyCode == '13' && next()" alt="다음 곡 스킵 버튼">skip_next</i>
            <i v-if="usePlayer" class="material-icons diff" tabindex="8" v-show="!this.$store.state.player.playlist" alt="반복 설정 버튼" :class="{deactive: !audio.repeat}" v-on:click="repeat" v-on:keypress="ev => ev.keyCode == '13' && repeat()">sync</i>
            <i v-if="usePlayer" class="material-icons diff" tabindex="9" alt="설정 버튼" v-on:click="more" v-on:keypress="ev => ev.keyCode == '13' && more()">more_vert</i>
            <i class="material-icons player-close" tabindex="10" alt="닫기 버튼" v-on:click="close" v-on:keypress="ev => ev.keyCode == '13' && close()">close</i>
          </div>
        </div>
      </div>
      <div class="player-karaoke">
        <LLCTKaraoke v-if="this.id" :id="id" :time="time" :playing="playing" :tickEnable="this.tickVolume > 0" :autoScroll="true"></LLCTKaraoke>
      </div>
    </div>
    <div class="player-vertical" :class="{show: displayVertical}">
      <div class="content">
        <h3>음악 볼륨 <span class="value-indicator">{{Math.round(audioVolume * 100)}}%</span></h3>
        <input type="range" v-model="audioVolume" max="1" min="0" step="0.01"></input>
        <h3>틱소리 볼륨 <span class="value-indicator">{{Math.round(tickVolume * 100)}}%</span></h3>
        <input type="range" v-model="tickVolume" max="1" min="0" step="0.01" value="1"></input>
        <h3>재생 속도 <span class="value-indicator">{{playbackSpeed}}x</span></h3>
        <input type="range" v-model="playbackSpeed" max="2" min="0.2" step="0.05" value="1"></input>
        <div class="inset">
          <h3>플레이리스트 반복 재생</h3>
          <LLCTCheckbox id="playlistRepeat" :checked="playlistRepeat" :onChange="(v) => playlistRepeat = v.target.checked"></LLCTCheckbox>
        </div>
        <div class="inset">
          <h3>공연장 효과</h3>
          <LLCTCheckbox id="useLiveEffects" :disabled="useNativeMode" :checked="useLiveEffects" :onChange="(v) => useLiveEffects = v.target.checked"></LLCTCheckbox>
        </div>
        <h3>베이스 EQ <span class="value-indicator" :class="{warn: Number(audioBassVolume) >= 7.5}">{{useNativeMode ? '사용 불가능' : Number(audioBassVolume).toFixed(2) + 'db'}}</span></h3>
        <input type="range" v-if="!useNativeMode" v-model="audioBassVolume" max="15" min="-5" step="0.25"></input>
        <p v-if="useNativeMode" class="muted_warning"><i class="material-icons muted_warning">warning</i>음악 효과는 Native 모드에서 사용할 수 없습니다.</p>
        <p v-if="!useNativeMode" class="muted">
          SR: <span>{{audio.sampleRate}}</span>Hz<span v-if="audio.latency">, Render: <span class="latency-indicator" :class="{warn: renderLatency > 1, danger: renderLatency > 3}">{{renderLatency}}ms</span>, Latency: {{audio.latency}}ms</span>
        </p>
        </div>
      <div class="bg" v-on:click="displayVertical = false"></div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      time: null,
      url: '',
      loading: false,
      progress: 0,
      phase: 'fetching',
      load_progress: 100,
      time_went: '0:00',
      time_left: '0:00',
      __timeUpdate: null,
      __barCache: null,
      audio: window.audio,
      audioVolume: localStorage.getItem('LLCT.Audio.audioVolume') || 0.75,
      tickVolume: localStorage.getItem('LLCT.Audio.tickVolume') || 1,
      audioBassVolume: localStorage.getItem('LLCT.Audio.audioBassVolume') || 0,
      playbackSpeed: localStorage.getItem('LLCT.Audio.playbackSpeed') || 1,
      playlistRepeat:
        localStorage.getItem('LLCT.Audio.RepeatPlaylist') == 'true',
      useLiveEffects: localStorage.getItem('LLCT.Audio.LiveEffects') == 'true',
      useNativeMode: settings.get('useNativeMode'),
      karaoke: {},
      displayVertical: false,
      usePlayer: settings.get('usePlayer'),
      bar_size: 0,
      renderLatency: 0
    }
  },
  computed: {
    id () {
      return this.$store.state.player.metadata.id
    },
    title () {
      return this.$store.state.player.metadata.title
    },
    preferTitle () {
      return this.$store.state.player.metadata[
        this.$llctDatas.useTranslatedTitle ? 'translated' : 'title'
      ]
    },
    artist () {
      return this.$store.state.data.getArtist(
        this.$store.state,
        this.$store.state.player.metadata.id || '0',
        this.$store.state.player.metadata.artist
      )
    },

    playing () {
      return this.$store.state.player.play.ing
    },

    playable () {
      return this.$store.state.player.play.able
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 25 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    close () {
      this.$store.commit('tab/back')
    },

    play () {
      if (!this.playable) {
        this.$store.commit('player/playOnLoad', true)

        return false
      }

      this.$store.commit('player/playOnLoad', false)
      window.audio.play()
    },

    repeat () {
      window.audio.repeatToggle()
    },

    pause () {
      if (this.$store.state.player.play.autoplay) {
        this.$store.commit('player/playOnLoad', false)
      }

      window.audio.pause()
    },

    playPause () {
      return this[
        this.playing || this.$store.state.player.play.autoplay
          ? 'pause'
          : 'play'
      ]()
    },

    first () {
      if (
        this.$store.state.player.playlist &&
        this.$store.state.player.playlist.first
      ) {
        let first = this.$store.state.player.playlist.first()

        this.$store.dispatch('player/play', { obj: first })
        this.$store.commit('player/playOnLoad', true)

        history.pushState(
          {
            id: first.id,
            ...first,
            playlist: this.$store.state.player.playlist
          },
          first.title + ' - LLCT',
          '?id=' + first.id
        )

        window.audio.load(this.$llctDatas.base + '/audio/' + first.id)
        this.init()
      }
    },

    last () {
      if (
        this.$store.state.player.playlist &&
        this.$store.state.player.playlist.last
      ) {
        let last = this.$store.state.player.playlist.last()
        this.$store.dispatch('player/play', { obj: last })
        this.$store.commit('player/playOnLoad', true)

        history.pushState(
          {
            id: last.id,
            ...last,
            playlist: this.$store.state.player.playlist
          },
          last.title + ' - LLCT',
          '?id=' + last.id
        )

        window.audio.load(this.$llctDatas.base + '/audio/' + last.id)
        this.init()
      }
    },

    next () {
      if (
        this.$store.state.player.playlist &&
        this.$store.state.player.playlist.next
      ) {
        let end = this.$store.state.player.playlist.isEnd()
        let next = this.$store.state.player.playlist.next()
        this.$store.dispatch('player/play', { obj: next })
        this.$store.commit('player/playOnLoad', !end)

        history.pushState(
          {
            id: next.id,
            ...next,
            playlist: this.$store.state.player.playlist
          },
          next.title + ' - LLCT',
          '?id=' + next.id
        )

        window.audio.load(this.$llctDatas.base + '/audio/' + next.id)
        this.init()
      }
    },

    prev () {
      if (
        this.$store.state.player.playlist &&
        this.$store.state.player.playlist.prev
      ) {
        let prev = this.$store.state.player.playlist.prev()
        this.$store.dispatch('player/play', { obj: prev })
        this.$store.commit('player/playOnLoad', true)

        window.audio.load(this.$llctDatas.base + '/audio/' + prev.id)
        this.init()
      }
    },

    more (ev) {
      this.displayVertical = true
    },

    volumeUp (v) {
      this.audioVolume =
        this.audioVolume + v > 1 ? 1 : Number(this.audioVolume) + v
    },

    volumeDown (v) {
      this.audioVolume =
        this.audioVolume - v < 0 ? 0 : Number(this.audioVolume) - v
    },

    keyStoke (ev) {
      let code = ev.keyCode

      if (ev.target instanceof HTMLInputElement && ev.target.type == 'text') {
        return true
      }

      switch (code) {
        case 27: // Esc
          if (this.displayVertical) this.displayVertical = false
          break
        case 32: // Space
          this.playPause()
          ev.preventDefault()
          break
        case 37: // Arrow Left
          window.audio.seekPrev(5)
          ev.preventDefault()
          break
        case 39: // Arrow Right
          window.audio.seekNext(5)
          ev.preventDefault()
          break
        case 38: // Arrow Up?
          this.volumeUp(0.05)
          ev.preventDefault()
          break
        case 40: // Arrow Down
          this.volumeDown(0.05)
          ev.preventDefault()
          break
        default:
      }
    },

    timeUpdate () {
      let current = window.audio.currentTime
      let duration = window.audio.duration
      this.time_went = timeStamp(current | 0)
      this.time_left = timeStamp((duration - current) | 0)

      this.time = current

      this.progress = current === 0 ? 0 : current / duration
    },

    watchUpdate (playing) {
      if (!playing) {
        return this.__timeUpdate
          ? cancelAnimationFrame(this.__timeUpdate)
          : null
      }

      let v = () => {
        if (!this.current) return

        this.timeUpdate()
        this.__timeUpdate = requestAnimationFrame(v)
      }
      v()
    },

    thumbProgress (ev) {
      if ((ev.type == 'dragstart' || ev.type == 'click') && !this.__barCache) {
        this.__barCache = ev.target.parentElement.getBoundingClientRect()
      }

      let p = (ev.x - this.__barCache.x) / this.__barCache.width
      if (p < 0) return false

      window.audio.progress = p

      if (!this.playing) {
        this.timeUpdate()
      }

      return true
    },

    updateBarSize () {
      requestAnimationFrame(() => {
        let el = this.$el.querySelector('.bar')

        if (!el) {
          return
        }

        this.bar_size = el.getBoundingClientRect().width
      })
    },

    init () {
      if (!this.$store.state.player.metadata.id) {
        show(
          '플레이어',
          '재생 중인 곡이 없습니다.',
          null,
          () => {
            this.close()
          },
          null,
          null,
          null
        )

        return
      }

      this.useNativeMode = settings.get('useNativeMode')
      this.usePlayer = settings.get('usePlayer')
      this.phase = 'fetching'
      this.loading = true

      window.audio.events.on(
        'play',
        () => {
          this.$llctEvents.$emit('karaokeUpdate')
          this.$store.commit('player/playStateUpdate', true)
        },
        'playerInstance'
      )

      window.audio.events.on(
        'pause',
        () => {
          this.$store.commit('player/playStateUpdate', false)
        },
        'playerInstance'
      )

      window.audio.events.on('loading', (done, size) => {
        this.phase = 'buffering'
        this.load_progress = (done / size) * 100
      })

      window.audio.events.on(
        'end',
        () => {
          if (this.$store.state.player.playlist) {
            if (!this.$store.state.player.playlist.isEnd()) {
              return this.next()
            } else if (this.$store.state.player.playlist.repeat) {
              return this.first()
            }
          }

          this.$store.commit('player/playStateUpdate', false)
        },
        'playerInstance'
      )

      window.audio.events.on(
        'playable',
        () => {
          this.phase = 'ready'

          this.$store.commit('player/ableStateUpdate', true)
          this.timeUpdate()

          if (this.$store.state.player.play.autoplay) {
            this.play()
          }
        },
        'playerInstance'
      )

      window.audio.volume = this.audioVolume
      window.audio.bassVolume = this.audioBassVolume
      window.audio.speed = this.playbackSpeed

      let delay = Date.now()
      window.audio.events.on(
        'seek',
        short => {
          if (short && delay + 10 < Date.now()) {
            this.$llctEvents.$emit('karaokeUpdate')
          }
        },
        'playerInstance'
      )

      this.url = this.$llctDatas.base + '/cover/' + this.id
      window.audio.setMetadata(this.title, this.artist, this.url)
      this.$store.commit('player/playStateUpdate', window.audio.playing)
    }
  },
  watch: {
    current (value) {
      if (value) this.init()
      if (this.playing) {
        this.watchUpdate(true)
      }

      if (this.displayVertical) {
        this.displayVertical = false
      }
    },

    playing (value) {
      this.watchUpdate(value)
      this.updateBarSize()
    },

    audioVolume (v) {
      window.audio.volume = v
      localStorage.setItem('LLCT.Audio.audioVolume', v)
    },

    audioBassVolume (v) {
      window.audio.bassVolume = v
      localStorage.setItem('LLCT.Audio.audioBassVolume', v)
    },

    tickVolume (v) {
      localStorage.setItem('LLCT.Audio.tickVolume', v)
    },

    playbackSpeed (v) {
      window.audio.speed = v
      localStorage.setItem('LLCT.Audio.playbackSpeed', v)
    },

    playlistRepeat (v) {
      if (this.$store.state.player.playlist) {
        this.$store.commit('player/repeat', LLCTRepeatState.REPEAT_PLAYLIST)
      }

      localStorage.setItem('LLCT.Audio.RepeatPlaylist', v)
    },

    useLiveEffects (v) {
      if (window.audio) {
        window.audio.liveEffect(v)
      }

      localStorage.setItem('LLCT.Audio.LiveEffects', v)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyStoke)

    window.audio.next = this.next
    window.audio.prev = this.prev

    window.addEventListener('resize', () => {
      this.updateBarSize()
    })
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.keyStoke)
  }
}
