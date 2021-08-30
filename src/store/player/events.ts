import { MusicPlayerState } from '@/@types/state'

export interface PlayerRootEvents {
  onStateChange: (state: MusicPlayerState) => void
}
