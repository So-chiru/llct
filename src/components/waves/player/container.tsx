import { MusicPlayerState } from '@/@types/state'
import PlayerWaveComponent from './component'

interface PlayerWaveContainerProps {
  show?: boolean
  state: MusicPlayerState
  progress?: number
  progressListener: () => number
}

const PlayerWaveContainer = ({
  show,
  state,
  progressListener,
  progress
}: PlayerWaveContainerProps) => {
  return (
    <PlayerWaveComponent
      progress={progress}
      listener={progressListener}
      show={show}
      state={state}
    ></PlayerWaveComponent>
  )
}

export default PlayerWaveContainer
