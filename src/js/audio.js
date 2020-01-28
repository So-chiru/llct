const LLCTAudio = class {
  constructor () {
    this.audio = document.createElement('audio')
    this.audio.style.display = 'none'
  }

  load (url) {
    this.audio.src = url
    this.audio.load()
  }

  get src () {
    return this.audio.src
  }

  play () {
    this.audio.play()
  }

  pause () {
    this.audio.pause()
  }

  currentTime () {
    return this.audio.currentTime
  }

  timecode () {
    return this.audio.currentTime / 100
  }
}
