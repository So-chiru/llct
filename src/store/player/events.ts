import { PlayerState } from './reducer'

export interface PlayerRootEvents {
  onStateChange: (state: PlayerState) => void
}
