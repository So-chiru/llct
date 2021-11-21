import eventBus from '@/core/eventbus'

interface LLCTExternalMetadata {
  title: string
  artist: string
  image?: string
}

interface LLCTAudioStack {
  play: () => void
  pause: () => void
  stop: () => void

  src?: string
  load: (src: string) => void
  type: string

  /**
   * 플레이어가 외부 플레이어인지에 대한 여부입니다. 외부 플레이어의 경우 재생 중인 곡이 사이트와 관련 곡인지에 대한 여부를 보장할 수 없어 사용합니다.
   */
  external: boolean

  /**
   * 사이트에서 제공하는 곡이 아닌지에 대한 여부입니다. 외부 플레이어를 사용할 때 사용합니다.
   */
  notSiteSong?: boolean

  /**
   * 외부 플레이어에서 다른 곡을 재생하고 있을 때 표시할 메타데이터 정보입니다.
   */
  externalMetadata?: LLCTExternalMetadata

  volume: number

  current: number
  duration: number
  progress: number
  timecode: number
  speed?: number

  destroy: () => void

  updateMetadata?: (title: string, artist: string, cover: string) => void

  /**
   * 오디오 스택이 음향 효과를 지원하는지에 대한 여부.
   */
  supportEffects: boolean

  /**
   * 플레이어 이벤트들을 수행하는 eventBus
   */
  events: eventBus<LLCTAudioStackEventMap>
}

interface LLCTAudioStackEventMap {
  play: () => void
  pause: () => void
  end: () => void
  metadata: () => void
  playerID: (id: string) => void
  error: (err: Error) => void
  load: () => void
  requestPreviousTrack: () => void
  requestNextTrack: () => void
  siteSongUpdate: (siteSong: boolean) => void
  siteMetadataUpdate: (metadata: LLCTExternalMetadata | undefined) => void
}
