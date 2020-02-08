const LLCTAudio = class {
  constructor (skipMedia) {
    this.audio = document.createElement('audio')
    this.audio.style.display = 'none'
    this.animation = null
    this.originVolume = this.audio.volume
    this.events = {}
    this.playlists = {}
    this.repeat = false

    this.supportMedia = !skipMedia && navigator.mediaSession

    if (navigator.mediaSession && !skipMedia) {
      this.sessionInit()
    }

    this.audio.addEventListener('canplaythrough', () => {
      this.run('playable')
    })

    this.audio.addEventListener('ended', () => {
      this.run('end')

      if (this.repeat) this.play()
    })

    this.volume = 0.75
  }

  fadeOut () {
    // TODO : FadeOut
  }

  fadeIn () {
    // TODO : FadeIn
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

  load (url) {
    this.audio.src = url

    this.run('load')
    this.audio.load()
  }

  get src () {
    return this.audio.src
  }

  get playing () {
    return !this.audio.paused
  }

  get volume () {
    return this.originVolume
  }

  set volume (v) {
    if (typeof v === 'string') v = Number(v)

    this.originVolume = v
    this.audio.volume = v
  }

  get speed () {
    return this.audio.playbackRate
  }

  set speed (v) {
    this.audio.playbackRate = v
  }

  volumeDown (v) {
    this.volume = this.volume - v < 0 ? 0 : this.volume - v
  }

  volumeUp (v) {
    this.volume = this.volume + v > 1 ? 1 : this.volume + v
  }

  get progress () {
    return this.audio.currentTime / this.audio.duration
  }

  set progress (per) {
    this.audio.currentTime = this.audio.duration * per
    this.run('seek')
  }

  get time () {
    return this.audio.currentTime
  }

  set time (t) {
    this.audio.currentTime = t
    this.run('seek')
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
    this.audio.currentTime = this.audio.currentTime - t
    this.run('seek')
  }

  seekNext (t) {
    this.audio.currentTime = this.audio.currentTime + t
    this.run('seek')
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

  play () {
    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'playing'
    }

    try {
      this.audio.play()
    } catch (e) {}
    this.run('play')
  }

  pause () {
    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'paused'
    }

    this.audio.pause()
    this.run('pause')
  }

  playPause () {
    this[this.audio.paused ? 'play' : 'pause']()
  }

  currentTime () {
    return this.audio.currentTime
  }

  duration () {
    return this.audio.duration
  }

  timecode () {
    return this.audio.currentTime * 100
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
