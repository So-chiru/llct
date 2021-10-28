import eventBus from '@/core/eventbus'

export default class LLCTNativeAudio implements LLCTAudioStack {
  player: HTMLAudioElement
  src?: string
  private volumeStore: number

  supportEffects = false
  events = new eventBus<LLCTAudioStackEventMap>()
  type = 'native'

  constructor () {
    this.player = new Audio()
    this.volumeStore = 1

    this.handlerInit()
    this.mediaStateInit()
  }

  handlerInit () {
    this.player.addEventListener('play', () => {
      this.events.runAll('play')
    })

    this.player.addEventListener('pause', () => {
      this.events.runAll('pause')
    })

    this.player.addEventListener('ended', () => {
      this.events.runAll('end')
    })

    this.player.addEventListener('loadedmetadata', () => {
      this.events.runAll('metadata')
    })

    this.player.addEventListener('load', () => {
      this.events.runAll('load')
    })
  }

  mediaStateInit () {
    if (!navigator.mediaSession) {
      return
    }

    navigator.mediaSession.setActionHandler('play', () => {
      this.player.play()
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      this.player.pause()
    })
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.events.runAll('requestPreviousTrack')
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.events.runAll('requestNextTrack')
    })
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      this.player.currentTime = Math.max(0, this.player.currentTime - 5)
    })
    navigator.mediaSession.setActionHandler('seekforward', () => {
      this.player.currentTime = Math.min(
        this.player.duration,
        this.player.currentTime + 5
      )
    })

    this.events.on('play', () => {
      if (!navigator.mediaSession) {
        return
      }

      navigator.mediaSession.playbackState = 'playing'
    })

    this.events.on('pause', () => {
      if (!navigator.mediaSession) {
        return
      }

      navigator.mediaSession.playbackState = 'paused'
    })
  }

  updateMetadata (title: string, artist: string, cover: string) {
    if (!navigator.mediaSession) {
      return
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: 'LLCT',
      artwork: [{ src: cover }]
    })
  }

  play () {
    return this.player.play()
  }

  pause () {
    return this.player.pause()
  }

  stop () {
    return this.player.load()
  }

  get speed () {
    return this.player.playbackRate
  }

  set speed (num: number) {
    this.player.playbackRate = num
  }

  load(src: string) {
    if (process.env.NO_AUDIO_MODE === 'true') {
      return
    }

    this.player.src = src
    this.player.load()
    this.progress = 0

    this.src = src
  }

  get current () {
    return this.player.currentTime
  }

  set current (seek: number) {
    this.player.currentTime = seek
  }

  get duration () {
    return this.player.duration
  }

  get progress () {
    return this.current / this.duration
  }

  set progress (seek: number) {
    this.current = (this.duration || 1) * seek
  }

  get timecode () {
    return ~~(this.current * 100)
  }

  get volume () {
    return this.volumeStore
  }

  set volume (vol: number) {
    this.volumeStore = vol
    this.player.volume = vol
  }
}
