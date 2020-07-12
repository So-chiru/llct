const timeStamp = num => {
  return new Date((num || 0) * 1000).toISOString().substr(14, 5)
}

Vue.component('llct-player', {
  template: `<div class="llct-tab llct-tab-over" id="tab4">
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
            <i v-if="usePlayer" class="material-icons" tabindex="5" v-show="!playing && !play_onload" v-on:click="play" v-on:keypress="ev => ev.keyCode == '13' && play()" alt="재생 버튼">play_arrow</i>
            <i v-if="usePlayer" class="material-icons" tabindex="6" v-show="playing || play_onload" v-on:click="pause" v-on:keypress="ev => ev.keyCode == '13' && pause()" alt="일시정지 버튼">pause</i>
            <i v-if="usePlayer" class="material-icons" tabindex="7" v-show="audio.playlist" v-on:click="next" v-on:keypress="ev => ev.keyCode == '13' && next()" alt="다음 곡 스킵 버튼">skip_next</i>
            <i v-if="usePlayer" class="material-icons diff" tabindex="8" v-show="!audio.playlist" alt="반복 설정 버튼" :class="{deactive: !audio.repeat}" v-on:click="repeat" v-on:keypress="ev => ev.keyCode == '13' && repeat()">sync</i>
            <i v-if="usePlayer" class="material-icons diff" tabindex="9" alt="설정 버튼" v-on:click="more" v-on:keypress="ev => ev.keyCode == '13' && more()">more_vert</i>
            <i class="material-icons player-close" tabindex="10" alt="닫기 버튼" v-on:click="close" v-on:keypress="ev => ev.keyCode == '13' && close()">close</i>
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
        <h3>플레이리스트 반복 재생 <span class="value-indicator">{{playlistRepeat && '켜짐' || '꺼짐'}}</span></h3>
        <input type="checkbox" v-model="playlistRepeat" checked="false"></input>
        <h3>공연장 효과 <span class="value-indicator">{{useNativeMode ? '사용 불가능' : useLiveEffects && '켜짐' || '꺼짐'}}</span></h3>
        <input type="checkbox" v-model="useLiveEffects" :disabled="useNativeMode" checked="false"></input>
        <h3>베이스 EQ <span class="value-indicator" :class="{warn: Number(audioBassVolume) >= 7.5}">{{useNativeMode ? '사용 불가능' : Number(audioBassVolume).toFixed(2) + 'db'}}</span></h3>
        <input type="range" :disabled="useNativeMode" v-model="audioBassVolume" max="15" min="-5" step="0.25"></input>
        <p v-if="useNativeMode" class="muted_warning"><i class="material-icons muted_warning">warning</i>음악 효과는 Native 모드에서 사용할 수 없습니다.</p>
        <p v-if="!useNativeMode" class="muted">
          SR: <span>{{audio.sampleRate}}</span>Hz, <span v-if="audio.latency">Latency: {{audio.latency}}ms {{audio.outputLatency ? '(o / ' + audio.outputLatency + 'ms)' : '' }}</span>
        </p>
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
      loading: false,
      play_onload: false,
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
      useNativeMode: LLCTSettings.get('useNativeMode'),
      karaoke: {},
      updates: null,
      displayVertical: false,
      usePlayer: LLCTSettings.get('usePlayer'),
      bar_size: 0
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
      this.$llctEvents.$emit('requestGoBack')
    },

    play () {
      if (!this.playable) {
        this.play_onload = true

        return false
      }

      this.play_onload = false
      window.audio.play()
    },

    repeat () {
      window.audio.repeatToggle()
    },

    pause () {
      if (this.play_onload) {
        this.play_onload = false
      }

      window.audio.pause()
    },

    playPause () {
      return this[this.playing || this.play_onload ? 'pause' : 'play']()
    },

    first () {
      if (audio.playlist && audio.playlist.first) {
        let first = audio.playlist.first()
        this.$llctDatas.meta = first
        this.play_onload = true

        history.pushState(
          { id: first.id, ...first, playlist: window.audio.playlist },
          first.title + ' - LLCT',
          '?id=' + first.id
        )

        audio.load(this.$llctDatas.base + '/audio/' + first.id)
        this.init()
      }
    },

    last () {
      if (audio.playlist && audio.playlist.last) {
        let last = audio.playlist.last()
        this.$llctDatas.meta = last
        this.play_onload = true

        history.pushState(
          { id: last.id, ...last, playlist: window.audio.playlist },
          last.title + ' - LLCT',
          '?id=' + last.id
        )

        audio.load(this.$llctDatas.base + '/audio/' + last.id)
        this.init()
      }
    },

    next () {
      if (audio.playlist && audio.playlist.next) {
        let end = window.audio.playlist.isEnd()
        let next = audio.playlist.next()
        this.$llctDatas.meta = next
        this.play_onload = !end

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
        this.play_onload = true

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
          this.playPause()
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
      let current = window.audio.currentTime
      let duration = window.audio.duration
      this.time_went = timeStamp(Math.floor(current))
      this.time_left = timeStamp(Math.floor(duration - current))

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
        this.bar_size = this.$el
          .querySelector('.bar')
          .getBoundingClientRect().width
      })
    },

    init () {
      if (!this.$llctDatas.meta) {
        window.showModal('플레이어', '재생 중인 곡이 없습니다.', null, () => {
          this.close()
        })

        return
      }

      this.useNativeMode = LLCTSettings.get('useNativeMode')
      this.usePlayer = LLCTSettings.get('usePlayer')
      this.phase = 'fetching'
      this.loading = true

      audio.events.on(
        'play',
        () => {
          this.updates = Math.random()
          this.playing = true
        },
        'playerInstance'
      )

      audio.events.on(
        'pause',
        () => {
          this.playing = false
        },
        'playerInstance'
      )

      audio.events.on('loading', (done, size) => {
        this.phase = 'buffering'
        this.load_progress = (done / size) * 100
      })

      audio.events.on(
        'end',
        () => {
          if (window.audio.playlist) {
            if (!window.audio.playlist.isEnd()) {
              return this.next()
            } else if (window.audio.playlist.repeat) {
              return this.first()
            }
          }

          this.playing = false
        },
        'playerInstance'
      )

      audio.events.on(
        'playable',
        () => {
          this.phase = 'ready'

          this.playable = true
          this.timeUpdate()

          if (this.play_onload) {
            this.play()
          }
        },
        'playerInstance'
      )

      audio.volume = this.audioVolume
      audio.bassVolume = this.audioBassVolume
      audio.speed = this.playbackSpeed

      if (karaokeTick) {
        karaokeTick.volume = this.tickVolume
      }

      let delay = Date.now()
      audio.events.on(
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
    }
  },
  watch: {
    current (value) {
      if (value) this.init()
      if (this.playing) {
        this.watchUpdate(this.playing)
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
      karaokeTick.volume = v
      localStorage.setItem('LLCT.Audio.tickVolume', v)
    },

    playbackSpeed (v) {
      window.audio.speed = v
      localStorage.setItem('LLCT.Audio.playbackSpeed', v)
    },

    playlistRepeat (v) {
      if (window.audio.playlist) {
        window.audio.playlist.repeat = v
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

    audio.next = this.next
    audio.prev = this.prev

    this.$llctEvents.$on('callContentChange', () => {
      this.init()
    })

    this.$llctEvents.$on('setPlayOnLoad', v => {
      this.play_onload = v
    })

    window.addEventListener('resize', () => {
      this.updateBarSize()
    })
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.keyStoke)
  }
})
