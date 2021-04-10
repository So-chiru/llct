export default class LLCTAdvancedAudio implements LLCTAudioStack {
  player: HTMLAudioElement

  supportEffects = false

  volume = 1

  constructor () {
    this.player = new Audio()
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
  }

  get current () {
    return this.player.currentTime
  }

  set current (seek: number) {
    this.player.currentTime = seek

    console.log(seek)
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
}
