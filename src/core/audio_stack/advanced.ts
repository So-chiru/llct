import eventBus from '@/core/eventbus'

import { LLCTAudioStack } from '@/@types/audio'
import { LLCTAudioStackEventMap } from '@/@types/audio'

const loadURLAsBuffer = (src: string) => {
  return fetch(src).then(res => {
    return res.arrayBuffer()
  })
}

/**
 *      AudioContext.destination
 *                |
 *              Gain
 *                |
 *          Plugins[chain]
 *                |
 *            AudioSource
 */
export default class LLCTAdvancedAudio implements LLCTAudioStack {
  context: AudioContext

  supportEffects = true
  events = new eventBus<LLCTAudioStackEventMap>()
  type = 'advanced'

  source: AudioBufferSourceNode
  gain: GainNode
  plugins: AudioNode[]

  external = false

  loadedData?: AudioBuffer

  startOffset = 0
  lastStarted = 0

  volume = 1

  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()

    if (!this.context) {
      alert(
        '이 브라우저는 AudioContext API를 지원하지 않습니다. Native 모드를 사용하세요.'
      )

      throw new Error(
        "This browser doesn't support AudioContext API. Use native mode instead."
      )
    }

    window.alert(
      'Advanced 오디오 스택은 현재 불안정하며 기능이 지원되지 않을 수 있습니다.'
    )

    this.plugins = []

    this.source = this.context.createBufferSource()

    this.gain = this.context.createGain()
    this.gain.gain.value = 1

    this.gain.connect(this.context.destination)
  }

  destroy () {}

  play () {
    if (!this.loadedData) {
      return
    }

    if (this.context.state === 'suspended') {
      this.context.resume()
    }

    this.source = this.context.createBufferSource()
    this.source.buffer = this.loadedData
    this.source.connect(this.gain)

    this.lastStarted = this.context.currentTime
    this.source.start(0, this.startOffset)
  }

  pause () {
    this.startOffset =
      this.startOffset + (this.context.currentTime - this.lastStarted)

    this.source.disconnect()
    this.context.suspend()
  }

  stop () {
    this.pause()
  }

  async load (src: string) {
    try {
      const buffer = await loadURLAsBuffer(src)
      this.loadedData = await this.context.decodeAudioData(buffer)

      this.events.runAll('metadata')

      this.source.buffer = this.loadedData

      this.events.runAll('load')
    } catch (e) {
      this.events.runAll('error', e as Error)
    }
  }

  get timecode () {
    return this.current * 100
  }

  get progress () {
    return this.current / this.duration
  }

  set progress (seek: number) {
    this.current = this.duration * seek
  }

  get speed () {
    return 1
  }

  set speed (num: number) {}

  get current () {
    if (this.context.state === 'running') {
      return this.startOffset + (this.context.currentTime - this.lastStarted)
    }

    return this.startOffset
  }

  set current (time: number) {
    this.startOffset = time
  }

  get duration () {
    return (this.loadedData && this.loadedData.duration) || 1
  }
}
