import PlayerWaveComponent from './component'

interface PlayerWaveContainerProps {
  show?: boolean
}

const PlayerWaveContainer = ({ show }: PlayerWaveContainerProps) => {
  // TODO : 플레이어 진행도 가져오기

  return <PlayerWaveComponent progress={0.5} show={show}></PlayerWaveComponent>
}

export default PlayerWaveContainer
