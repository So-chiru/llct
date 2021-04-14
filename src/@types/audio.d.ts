interface LLCTAudioStack {
  play: () => void
  pause: () => void
  stop: () => void

  src?: string
  load: (src: string) => void

  volume: number

  current: number
  duration: number
  progress: number

  timecode: () => number

  /**
   * 오디오 스택이 음향 효과를 지원하는지에 대한 여부.
   */
  supportEffects: boolean

  /**
   * 플레이어 이벤트들을 수행하는 eventBus
   */
  events: LLCTEventBus<LLCTAudioStackEventMap>
}

interface LLCTAudioStackEventMap {
  play: () => void
  pause: () => void
  end: () => void
  metadata: () => void
  load: () => void
}
