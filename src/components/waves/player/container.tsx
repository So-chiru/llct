import { MusicPlayerState } from '@/@types/state'
import PlayerWaveComponent from './component'

interface PlayerWaveContainerProps {
  show?: boolean
  state: MusicPlayerState
  progress: number
}

const PlayerWaveContainer = ({
  show,
  state,
  progress
}: PlayerWaveContainerProps) => {
  return (
    <PlayerWaveComponent
      progress={progress}
      show={show}
      state={state}
    ></PlayerWaveComponent>
  )
}

export default PlayerWaveContainer
