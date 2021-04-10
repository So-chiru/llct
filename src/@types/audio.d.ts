interface LLCTAudioStack {
  play: () => void
  pause: () => void
  stop: () => void

  load: (src: string) => void

  volume: number

  current: number
  duration: number
  progress: number

  /**
   * 오디오 스택이 음향 효과를 지원하는지에 대한 여부.
   */
  supportEffects: boolean
}
