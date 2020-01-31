const LLCTAudio = class {
  constructor () {
    this.audio = document.createElement('audio')
    this.audio.style.display = 'none'
    this.events = {}

    if (navigator.mediaSession) {
      this.supportMedia = true
      this.sessionInit()
    }
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

  play () {
    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'playing'
    }

    this.run('play')

    this.audio.play()
  }

  pause () {
    if (this.supportMedia) {
      navigator.mediaSession.playbackState = 'paused'
    }

    this.run('pause')

    this.audio.pause()
  }

  currentTime () {
    return this.audio.currentTime
  }

  timecode () {
    return this.audio.currentTime / 100
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
