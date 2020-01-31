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
          <div class="player-control">
            <div class="player-progress">
              <div class="player-progress-inner">
                <div class="current">0:00</div>
                <div class="bar">
                  <div class="bar-current"></div>
                  <div class="bar-load"></div>
                  <div class="bar-bg"></div>
                </div>
                <div class="left">-0:00</div>
              </div>
            </div>
            <div class="player-btn">
              <i class="material-icons" v-show="!playing" v-on:click="play">play_arrow</i>
              <i class="material-icons" v-show="playing" v-on:click="pause">pause</i>
              <i class="material-icons" v-on:click="skip">skip_next</i>
              <i class="material-icons diff" v-on:click="sync">sync</i>
            </div>
          </div>
        </div>
        <div class="player-close" v-on:click="close">
          <i class="material-icons">close</i>
        </div>
      </div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      title: '',
      artist: '',
      url: '',
      playing: false
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

    skip() {
      window.audio.next()
    },

    sync() {

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
    }
  },
  mounted () {}
})
