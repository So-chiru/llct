const timeStamp = num => {
  return new Date((num || 0) * 1000).toISOString().substr(14, 5)
}

Vue.component('llct-player', {
  template: `<div class="llct-tab llct-tab-over" id="3">
    <div class="llct-player">
      <div class="player-dash" v-show="title != ''">
        <div class="player-left">
          <div class="player-info">
            <div class="player-info-image">
              <img :src="url"></img>
            </div>
            <div class="player-info-text">
              <p class="player-song-title">{{title}}</p>
              <p class="player-song-artist">{{artist}}</p>
            </div>
          </div>
          <div class="player-progress">
            <div class="player-progress-inner">
              <div class="current">{{time_went}}</div>
              <div class="bar" v-on:click="thumbProgress" v-on:dragstart="thumbProgress" v-on:drag="thumbProgress">
                <div class="bar-thumb" :style="{left: 'calc(' + progress + '% - 8px)'}" v-on:dragstart="thumbProgress" v-on:drag="thumbProgress" draggable="true"></div>
                <div class="bar-current" :style="{width: progress + '%'}" v-if="playable"></div>
                <div class="bar-load" v-else></div>
                <div class="bar-bg"></div>
              </div>
              <div class="left">-{{time_left}}</div>
            </div>
          </div>
          <div class="player-btn">
            <i class="material-icons" v-show="!playing" v-on:click="play">play_arrow</i>
            <i class="material-icons" v-show="playing" v-on:click="pause">pause</i>
            <i class="material-icons" v-on:click="skip">skip_next</i>
            <i class="material-icons diff" v-on:click="sync">sync</i>
            <i class="material-icons player-close" v-on:click="close">close</i>
          </div>
        </div>
      </div>
      <div class="player-karaoke">
        <llct-karaoke v-if="this.id" :id="id"></llct-karaoke>
      </div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      id: null,
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
      karaoke: {}
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

    pause () {
      window.audio.pause()
    },

    skip () {
      window.audio.next()
    },

    sync () {},

    keyStoke(code, ctrl, alt, shift) {
      switch (code) {
        case 32: // Space
          audio.playPause()
          break
        case 37: // Arrow Left
          audio.seekPrev(5)
          break
        case 39: // Arrow Right
          audio.seekNext(5)
          break
        default:
      }
    },

    timeUpdate () {
      let current = window.audio.currentTime()
      let duration = window.audio.duration()
      this.time_went = timeStamp(Math.floor(current))
      this.time_left = timeStamp(Math.floor(duration - current))

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
      if (ev.type == 'dragstart' || ev.type == 'click') {
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
        window.showModal('플레이어', '재생 중인 곡이 없습니다.', () => {
          this.close()
        })

        return
      }

      window.audio.on(
        'play',
        () => {
          this.playing = true
        },
        'playerInstance'
      )

      window.audio.on(
        'pause',
        () => {
          this.playing = false
        },
        'playerInstance'
      )

      window.audio.on(
        'end',
        () => {
          this.playing = false
        },
        'playerInstance'
      )

      window.audio.on(
        'playable',
        () => {
          this.playable = true
        },
        'playerInstance'
      )

      if (this.$llctDatas.playActive) {
        audio.play()
        this.$llctDatas.playActive = false
      }

      this.id = this.$llctDatas.meta.id
      this.title = this.$llctDatas.meta.title
      this.artist = this.$llctDatas.artist(
        this.id,
        this.$llctDatas.meta.artist || '0'
      )
      this.url = this.$llctDatas.base + '/cover/' + this.id
    }
  },
  watch: {
    current (value) {
      if (value) this.init()

      if (this.playing) this.watchUpdate(this.playing)
    },

    playing (value) {
      this.watchUpdate(value)
    }
  },
  mounted () {
    window.addEventListener('keydown', ev => {
      this.keyStoke(ev.keyCode, ev.ctrlKey, ev.altKey, ev.shiftKey)
    })
  }
})
