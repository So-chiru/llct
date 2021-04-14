import eventBus from '@/core/eventbus'

export default class LLCTNativeAudio implements LLCTAudioStack {
  player: HTMLAudioElement
  src?: string
  private volumeStore: number

  supportEffects = false
  events = new eventBus<LLCTAudioStackEventMap>()

  constructor () {
    this.player = new Audio()
    this.volumeStore = 1

    this.handlerInit()
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

  play () {
    return this.player.play()
  }

  pause () {
    return this.player.pause()
  }

  stop () {
    return this.player.load()
  }

  load (src: string) {
    this.player.src = src
    this.player.load()

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
    this.current = this.duration * seek
  }

  get volume () {
    return this.volumeStore
  }

  set volume (vol: number) {
    this.volumeStore = vol
    this.player.volume = vol
  }
}
