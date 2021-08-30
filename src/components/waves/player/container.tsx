import { MusicPlayerState } from '@/@types/state'
import PlayerWaveComponent from './component'

interface PlayerWaveContainerProps {
  show?: boolean
  state: MusicPlayerState
  color?: string
  progress: () => number
}

const PlayerWaveContainer = ({
  show,
  state,
  color,
  progress
}: PlayerWaveContainerProps) => {
  return (
    <PlayerWaveComponent
      progress={progress}
      color={color}
      show={show}
      state={state}
    ></PlayerWaveComponent>
  )
}

export default PlayerWaveContainer
