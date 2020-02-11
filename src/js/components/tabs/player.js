const timeStamp = num => {
  return new Date((num || 0) * 1000).toISOString().substr(14, 5)
}

Vue.component('llct-player', {
  template: `<div class="llct-tab llct-tab-over" id="tab3">
    <div class="llct-player">
      <div class="player-dash" v-show="title != ''">
        <div class="player-left">
          <div class="player-info">
            <div class="player-info-image">
              <img :src="url"></img>
            </div>
            <div class="player-info-text">
              <p class="player-song-title" :title="title">{{title}}</p>
              <p class="player-song-artist" :title="artist">{{artist}}</p>
            </div>
          </div>
          <div class="player-progress">
            <div class="player-progress-inner" v-if="usePlayer">
              <div class="current">{{time_went}}</div>
              <div class="bar" v-on:click="thumbProgress">
                <div class="bar-thumb" :style="{left: 'calc(' + progress + '% - 8px)'}" v-on:dragstart="thumbProgress" v-on:drag="thumbProgress" draggable="true"></div>
                <div class="bar-current" :style="{width: progress + '%'}" v-if="playable"></div>
                <div class="bar-load" v-else></div>
                <div class="bar-bg"></div>
              </div>
              <div class="left">-{{time_left}}</div>
            </div>
          </div>
          <div class="player-btn">
            <i v-if="usePlayer" class="material-icons" v-show="!playing" v-on:click="play" alt="재생 버튼">play_arrow</i>
            <i v-if="usePlayer" class="material-icons" v-show="playing" v-on:click="pause" alt="일시정지 버튼">pause</i>
            <i v-if="usePlayer" class="material-icons" v-show="audio.playlist" v-on:click="next" alt="다음 곡 스킵 버튼">skip_next</i>
            <i v-if="usePlayer" class="material-icons diff" v-show="!audio.playlist" alt="반복 설정 버튼" :class="{deactive: !audio.repeat}" v-on:click="repeat">sync</i>
            <i v-if="usePlayer" class="material-icons diff" alt="설정 버튼" v-on:click="more">more_vert</i>
            <i class="material-icons player-close" alt="닫기 버튼" v-on:click="close">close</i>
          </div>
        </div>
      </div>
      <div class="player-karaoke">
        <llct-karaoke v-if="this.id" :id="id" :time="time" :playing="playing" :tickEnable="this.tickVolume > 0" :autoScroll="true" :updateKaraoke="updates"></llct-karaoke>
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
      </div>
      <div class="bg" v-on:click="displayVertical = false"></div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      id: null,
      time: null,
      title: '',
      artist: '',
      url: '',
      playing: false,
      playable: false,
      progress: 0,
      time_went: '0:00',
      time_left: '0:00',
      __timeUpdate: null,
      __barCache: null,
      audio: window.audio,
      audioVolume: localStorage.getItem('LLCT.Audio.audioVolume') || 0.75,
      tickVolume: localStorage.getItem('LLCT.Audio.tickVolume') || 1,
      playbackSpeed: localStorage.getItem('LLCT.Audio.playbackSpeed') || 1,
      karaoke: {},
      updates: null,
      displayVertical: false,
      usePlayer: LLCTSettings.get('usePlayer')
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 25 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    close () {
      this.$llctEvents.$emit('requestGoBack')
    },

    play () {
      window.audio.play()
    },

    repeat () {
      window.audio.repeatToggle()
    },

    pause () {
      window.audio.pause()
    },

    next () {
      if (audio.playlist && audio.playlist.next) {
        let end = window.audio.playlist.isEnd()
        let next = audio.playlist.next()
        this.$llctDatas.meta = next
        this.$llctDatas.playActive = !end

        history.pushState(
          { id: next.id, ...next, playlist: window.audio.playlist },
          next.title + ' - LLCT',
          '?id=' + next.id
        )

        audio.load(this.$llctDatas.base + '/audio/' + next.id)
        this.init()
      }
    },

    prev () {
      if (audio.playlist && audio.playlist.prev) {
        let prev = audio.playlist.prev()
        this.$llctDatas.meta = prev
        this.$llctDatas.playActive = true

        audio.load(this.$llctDatas.base + '/audio/' + prev.id)
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
          audio.playPause()
          ev.preventDefault()
          break
        case 37: // Arrow Left
          audio.seekPrev(5)
          ev.preventDefault()
          break
        case 39: // Arrow Right
          audio.seekNext(5)
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
      let current = window.audio.currentTime()
      let duration = window.audio.duration()
      this.time_went = timeStamp(Math.floor(current))
      this.time_left = timeStamp(Math.floor(duration - current))

      this.time = current

      this.progress = (current / duration) * 100
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

    init () {
      if (!this.$llctDatas.meta) {
        window.showModal('플레이어', '재생 중인 곡이 없습니다.', null, () => {
          this.close()
        })

        return
      }

      this.usePlayer = LLCTSettings.get('usePlayer')

      audio.on(
        'play',
        () => {
          this.playing = true
          this.updates = Math.random()
        },
        'playerInstance'
      )

      audio.on(
        'pause',
        () => {
          this.playing = false
          this.updates = Math.random()
        },
        'playerInstance'
      )

      audio.on(
        'end',
        () => {
          if (window.audio.playlist && !window.audio.playlist.isEnd()) {
            this.next()
            return
          }

          this.playing = false
        },
        'playerInstance'
      )

      audio.on(
        'playable',
        () => {
          this.playable = true
          this.timeUpdate()
        },
        'playerInstance'
      )

      audio.volume = this.audioVolume
      audio.speed = this.playbackSpeed

      if (karaokeTick) {
        karaokeTick.volume = this.tickVolume
      }

      let delay = Date.now()
      audio.on(
        'seek',
        short => {
          if (short && delay + 10 < Date.now()) {
            this.updates = Math.random()
          }
        },
        'playerInstance'
      )

      this.id = this.$llctDatas.meta.id
      this.title = this.$llctDatas.meta[
        this.$llctDatas.meta.translated &&
        LLCTSettings.get('useTranslatedTitle')
          ? 'translated'
          : 'title'
      ]
      this.artist = this.$llctDatas.artist(
        this.id,
        this.$llctDatas.meta.artist || '0'
      )
      this.url = this.$llctDatas.base + '/cover/' + this.id

      audio.setMetadata(this.title, this.artist, this.url)

      this.playing = audio.playing

      if (this.$llctDatas.playActive && this.usePlayer) {
        audio.play()
        this.$llctDatas.playActive = false
      }
    }
  },
  watch: {
    current (value) {
      if (value) this.init()
      if (this.playing) {
        this.updates = Math.random()
        this.watchUpdate(this.playing)
      }

      if (this.displayVertical) {
        this.displayVertical = false
      }
    },

    playing (value) {
      this.watchUpdate(value)
    },

    audioVolume (v) {
      window.audio.volume = v
      localStorage.setItem('LLCT.Audio.audioVolume', v)
    },

    tickVolume (v) {
      karaokeTick.volume = v
      localStorage.setItem('LLCT.Audio.tickVolume', v)
    },

    playbackSpeed (v) {
      window.audio.speed = v
      localStorage.setItem('LLCT.Audio.playbackSpeed', v)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyStoke)

    audio.next = this.next
    audio.prev = this.prev

    this.$llctEvents.$on('callContentChange', () => {
      this.init()
    })
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.keyStoke)
  }
})
