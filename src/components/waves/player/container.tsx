import { MusicPlayerState } from '@/@types/state'
import PlayerWaveComponent from './component'

interface PlayerWaveContainerProps {
  show?: boolean
  state: MusicPlayerState
  color?: string
  progress?: number
  progressListener: () => number
}

const PlayerWaveContainer = ({
  show,
  state,
  color,
  progressListener,
  progress
}: PlayerWaveContainerProps) => {
  return (
    <PlayerWaveComponent
      progress={progress}
      listener={progressListener}
      color={color}
      show={show}
      state={state}
    ></PlayerWaveComponent>
  )
}

export default PlayerWaveContainer
