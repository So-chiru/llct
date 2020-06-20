const quint = x => 1 - Math.pow(1 - x, 3)

const concatBuffer = (...bufs) => {
  let len = bufs.length
  let bytelen = bufs.reduce((p, c) => p.length + c.length)

  let result = new Uint8Array(bytelen)

  for (var i = 0; i < len; i++) {
    let buf = bufs[i]

    let tmp = new Uint8Array(result.byteLength + buf.byteLength)
    tmp.set(result, 0)
    tmp.set(new Uint8Array(buf), result.byteLength)

    result = tmp
  }

  return result.buffer
}

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
    this.loaded = 0
    this.full = 0
  }

  progress (res) {
    const reader = res.body.getReader()

    let buffer = []

    this.full = Number(res.headers.get('Content-Length'))

    return new Promise(async (resolve, _) => {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          resolve(concatBuffer(...buffer))
          break
        }

        this.loaded += value.length

        this.events.run('loading', this.loaded, this.full)

        buffer.push(value)
      }
    })
  }

  load (url) {
    this.loaded = 0
    this.full = 0

    fetch(url)
      .then(this.progress.bind(this))
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
  constructor (noMediaSession, noEffects) {
    this.audio = new LLCTAudioSource()
    this.animation = null
    this.originVolume = 0.75
    this.events = new LLCTEvent()
    this.playlists = {}
    this.repeat = false
    this.paused = true
    this.loaded = false

    if (noEffects) {
      this.disableEffects = true
    }

    this.transitionTime = 0.2
    this.audioTime = 0
    this.playbackRate = 1

    this.initAudioAPI()

    this.supportMedia = !noMediaSession && navigator.mediaSession

    if (navigator.mediaSession && !noMediaSession) {
      this.sessionInit()
    }

    this.audio.events.on('loading', (f, s) => this.events.run('loading', f, s))

    this.audio.events.on('canplaythrough', () => {
      // Can play
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

          this.loading = false
          this.events.run('playable')
        },

        e => 'Error with decoding audio data' + e.err
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

    this.loading = true
    this.audio.load(url)
    this.events.run('load')
  }

  createConvolver () {
    if (this.disableEffects) {
      return
    }

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

        e => 'Error with decoding audio data' + e.err
      )
    })
  }

  createCompressor () {
    this.compressor = this.context.createDynamicsCompressor()
    this.compressor.connect(this.destination)

    this.compressor.threshold.value = -30
    this.compressor.knee.value = 40
    this.compressor.ratio.value = 6
    this.compressor.attack.value = 0.2
    this.compressor.release.value = 0.25
  }

  destroyConvolver () {
    if (this.convolver) {
      this.convolver.disconnect()
      this.convolver = null
    }
  }

  destroyCompressor () {
    if (this.compressor) {
      this.compressor.disconnect()
      this.compressor = null
    }
  }

  initAudioAPI () {
    // Web Audio API
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.loadStart = new Date()
    this.destination = this.context.destination

    this.createCompressor()

    this.dry = this.context.createGain()
    this.wet = this.context.createGain()

    this.dry.connect(this.compressor)
    this.wet.connect(this.compressor)

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

        this.dry.gain.value = Math.min(
          1,
          this.volume * e * (this.convolver ? 0.8 : 1)
        )

        if (this.fadeTo > 0) {
          this.wet.gain.value = Math.min(1, this.volume * e * 0.2)
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
    this.dry.gain.value = v * (this.convolver ? 0.8 : 1)
    this.wet.gain.value = v * 0.2
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
