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
            <i class="material-icons" v-show="audio.playlist" v-on:click="next">skip_next</i>
            <i class="material-icons" v-show="!audio.playlist" :class="{deactive: !audio.repeat}" v-on:click="repeat">sync</i>
            <i class="material-icons diff" v-on:click="more">more_vert</i>
            <i class="material-icons player-close" v-on:click="close">close</i>
          </div>
        </div>
      </div>
      <div class="player-karaoke">
        <llct-karaoke v-if="this.id" :id="id" :time="time" :playing="playing" :autoScroll="true" :updateKaraoke="updates"></llct-karaoke>
      </div>
    </div>
    <div class="player-vertical" :class="{show: displayVertical}">
      <div class="content">
        <h3>음악 볼륨</h3>
        <input type="range" v-model="audioVolume" max="1" min="0" step="0.01" value="audio.volume"></input>
        <h3>틱소리 볼륨</h3>
        <input type="range" v-model="tickVolume" max="1" min="0" step="0.01" value="1"></input>
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
      audioVolume: 0.75,
      tickVolume: 1,
      karaoke: {},
      updates: null,
      displayVertical: false
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
      console.log(ev)
      this.displayVertical = true
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
          audio.volumeUp(0.05)
          ev.preventDefault()
          break
        case 40: // Arrow Down
          audio.volumeDown(0.05)
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
        window.showModal('플레이어', '재생 중인 곡이 없습니다.', null, () => {
          this.close()
        })

        return
      }

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

      audio.on(
        'seek',
        () => {
          this.updates = Math.random()
        },
        'playerInstance'
      )

      this.id = this.$llctDatas.meta.id
      this.title = this.$llctDatas.meta.title
      this.artist = this.$llctDatas.artist(
        this.id,
        this.$llctDatas.meta.artist || '0'
      )
      this.url = this.$llctDatas.base + '/cover/' + this.id

      this.playing = audio.playing

      if (this.$llctDatas.playActive) {
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
    },

    tickVolume (v) {
      karaokeTick.volume = v
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyStoke)

    this.$llctEvents.$on('callContentChange', () => {
      this.init()
    })
  }
})
