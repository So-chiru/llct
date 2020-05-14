const quint = x => 1 - Math.pow(1 - x, 3)

const LLCTEvent = class {
  constructor () {
    this.events = {}
  }

  on (name, cb, key) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    var i = this.events[name].length

    while (key && i--) {
      if (this.events[name][i].key == key) return false
    }

    return this.events[name].push({ key, cb })
  }

  off (name) {
    this.events[name] = {}
  }

  run (name, ...params) {
    if (!this.events[name]) return
    let i = this.events[name].length

    while (i--) {
      this.events[name][i].cb(...params)
    }
  }
}

const LLCTAudioSource = class {
  constructor () {
    this.buffer = null
    this.events = new LLCTEvent()
  }

  load (url) {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(v => {
        this.buffer = v

        this.events.run('load', v)
        this.events.run('canplaythrough')
      })
      .catch(err => {
        this.buffer = null

        console.error(err)
        this.events.run('error', err)
      })
  }
}

const LLCTAudio = class {
  constructor (noMediaSession) {
    this.audio = new LLCTAudioSource()
    this.animation = null
    this.originVolume = 0.75
    this.events = new LLCTEvent()
    this.playlists = {}
    this.repeat = false
    this.paused = true
    this.loaded = false

    this.transitionTime = 0.2
    this.audioTime = 0
    this.playbackRate = 1

    this.initAudioAPI()

    this.supportMedia = !noMediaSession && navigator.mediaSession

    if (navigator.mediaSession && !noMediaSession) {
      this.sessionInit()
    }

    this.audio.events.on('canplaythrough', () => {
      this.events.run('playable')
    })

    this.audio.events.on('load', data => {
      this.context.decodeAudioData(
        data,
        buffer => {
          this.currentTime = 0
          this.loadOffset = Math.max(0, (new Date() - this.loadStart) / 1000)
          this.loaded = true

          this.savedBuffer = buffer

          if (this.playOnLoad) {
            this.play()
          }
        },

        e => {
          'Error with decoding audio data' + e.err
        }
      )
    })

    this.events.on('ended', () => {
      this.events.run('end')

      if (this.repeat) this.play()
    })

    this.events.on('seek', () => {
      this.destroySource()

      if (this.playing) {
        this.play(null, true)
      } else {
        this.pause()
      }
    })

    this.volume = 0.75
  }

  fadeOut () {
    this.fadeTo = 0
    this.fadeUntil = this.context.currentTime + this.transitionTime
  }

  fadeIn () {
    this.fadeTo = this.volume
    this.fadeUntil = this.context.currentTime + this.transitionTime
  }

  load (url) {
    setTimeout(() => {
      this.pause()
    }, 0)
    this.destroySource()

    this.audio.load(url)
    this.events.run('load')
  }

  createConvolver () {
    this.convolver = this.context.createConvolver()
    this.convolverSource = new LLCTAudioSource()
    this.convolverSource.load('/assets/llct-effects-1.mp3')

    this.convolverSource.events.on('load', data => {
      this.context.decodeAudioData(
        data,
        buffer => {
          this.convolver.buffer = buffer

          if (this.source) {
            this.source.connect(this.convolver)
          }

          this.convolver.connect(this.wet)
        },

        e => {
          'Error with decoding audio data' + e.err
        }
      )
    })
  }

  destroyConvolver () {
    if (this.convolver) {
      this.convolver.disconnect()
      this.convolver = null
    }
  }

  initAudioAPI () {
    // Web Audio API
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.loadStart = new Date()
    this.destination = this.context.destination

    this.dry = this.context.createGain()
    this.wet = this.context.createGain()

    this.dry.connect(this.destination)
    this.wet.connect(this.destination)

    let timing = () => {
      requestAnimationFrame(timing)

      if (typeof this.fadeTo !== 'undefined') {
        let e = quint(
          Math.max(
            0,
            Math.min(
              0.3,
              this.fadeTo > 0
                ? this.context.currentTime - this.fadeUntil
                : this.fadeUntil - this.context.currentTime
            )
          ) / this.transitionTime
        )

        this.dry.gain.value = Math.min(1, this.volume * e)

        if (this.fadeTo > 0) {
          this.wet.gain.value = Math.min(1, this.volume * e * 0.25)
        }

        if (this.fadeUntil + 0.1 < this.context.currentTime) {
          this.fadeTo = undefined
          this.fadeUntil = undefined
        }
      }

      if (this.playing && this.__lastTime) {
        this.currentTime +=
          ((Date.now() - this.__lastTime) / 1000) * this.playbackRate
      }

      if (this.duration <= this.currentTime) {
        this.paused = true
        this.currentTime = 0

        this.events.run('ended')
      }

      this.__lastTime = Date.now()
    }

    timing()

    this.liveEffect(localStorage.getItem('LLCT.Audio.LiveEffects') == 'true')
  }

  liveEffect (toggle) {
    if (toggle) {
      this.createConvolver()
    } else {
      this.destroyConvolver()
    }
  }

  createSource (buffer) {
    if (this.source) {
      try {
        this.destroySource()
      } catch (e) {}
    }

    this.source = this.context.createBufferSource()

    this.source.buffer = buffer || this.savedBuffer
    this.source.playbackRate.value = this.playbackRate
    this.duration = (buffer || this.savedBuffer || {}).duration

    this.source.connect(this.dry)

    if (this.convolver) {
      this.source.connect(this.convolver)
    }
  }

  destroySource () {
    this.playOnLoad = false
    this.loaded = false

    if (this.source) {
      this.source.stop()
      this.source.buffer = null
      this.source = null
    }
  }

  get src () {
    return this.audio.src
  }

  get playing () {
    return !this.paused
  }

  get volume () {
    return this.originVolume
  }

  set volume (v) {
    if (typeof v === 'string') v = Number(v)

    this.originVolume = v
    this.dry.gain.value = v
    this.wet.gain.value = v * 0.25
  }

  get speed () {
    return this.playbackRate
  }

  set speed (v) {
    this.playbackRate = v

    if (this.source && this.source.playbackRate) {
      this.source.playbackRate.value = v
    }
  }

  volumeDown (v) {
    this.volume = this.volume - v < 0 ? 0 : this.volume - v
  }

  volumeUp (v) {
    this.volume = this.volume + v > 1 ? 1 : this.volume + v
  }

  get progress () {
    return this.currentTime / this.duration
  }

  set progress (per) {
    this.currentTime = this.duration * per
    this.events.run('seek')
  }

  get time () {
    return this.currentTime
  }

  set time (t) {
    this.currentTime = t
    this.events.run('seek')
  }

  set playlist (pl) {
    this.playlists = pl
  }

  get playlist () {
    return window.playlists ? window.playlists.find(this.playlists) : null
  }

  stop () {
    this.pause()
    this.load(null)
  }

  seekPrev (t) {
    this.audioTime = Math.max(0, this.audioTime - t)
    this.events.run('seek')
  }

  seekNext (t) {
    this.audioTime = Math.min(this.duration, this.audioTime + t)
    this.events.run('seek')
  }

  repeatToggle () {
    this.repeat = !this.repeat
  }

  setMetadata (title, artist, cover) {
    if (this.supportMedia) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        artwork: [{ src: cover }]
      })
    }
  }

  play (offset, skipFade) {
    if (!this.loaded) {
      this.playOnLoad = true
    }

    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'playing'
    }

    try {
      this.createSource()

      this.source.start(this.context.currentTime, offset || this.audioTime)

      if (this.useFadeInOut && !skipFade) {
        this.fadeIn()
      }

      this.paused = false
    } catch (e) {
      console.error(e)
    }

    this.events.run('play')
  }

  pause () {
    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'paused'
    }

    if (this.paused) {
      this.events.run('pause')
      return
    }

    try {
      this.source.stop(this.context.currentTime + (this.useFadeInOut ? 0.3 : 0))
    } catch (e) {
      console.error(e)
    }

    if (this.useFadeInOut) {
      this.fadeOut()
    }

    this.paused = true
    this.events.run('pause')
  }

  playPause () {
    this[this.playing ? 'pause' : 'play']()
  }

  get currentTime () {
    return this.audioTime
  }

  set currentTime (v) {
    this.audioTime = v
  }

  get duration () {
    return this.__d
  }

  set duration (v) {
    this.__d = v
  }

  timecode () {
    return this.currentTime * 100
  }

  sessionInit () {
    navigator.mediaSession.setActionHandler('play', () => {
      this.play()
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      this.pause()
    })
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.prev()
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.next()
    })
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      this.seekPrev(5)
    })
    navigator.mediaSession.setActionHandler('seekforward', () => {
      this.seekNext(5)
    })
  }
}
