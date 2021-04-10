export default class LLCTAdvancedAudio implements LLCTAudioStack {
  context: AudioContext

  supportEffects = true

  volume = 1

  constructor () {
    this.context = new AudioContext()

    if (!this.context) {
      throw new Error(
        "This browser doesn't support AudioContext API. Use native mode instead."
      )
    }
  }

  play () {}

  pause () {}

  stop () {}

  load () {}

  get progress () {
    return this.current / this.duration
  }

  get current () {
    return 0
  }

  get duration () {
    return 1
  }
}
