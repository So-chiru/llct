import '@/styles/components/player-button/player-button.scss'

import { MdMusicNote } from 'react-icons/md'
import { MusicPlayerState } from '@/@types/state'

import PlayerWaveContainer from '@/components/waves/player/container'

interface PlayerButtonProps {
  music: MusicMetadata
  state: MusicPlayerState
  show: boolean
  progress: () => number
  onClick: () => void
}

const BGLayer = (
  <div className='layer'>
    <MdMusicNote></MdMusicNote>
  </div>
)

const PlayerButtonComponent = ({
  music,
  state,
  show,
  progress,
  onClick
}: PlayerButtonProps) => {
  return (
    <div
      className={'llct-player-button' + (music && show ? ' show' : '')}
      data-state={state}
      onClick={onClick}
    >
      <PlayerWaveContainer
        show={show}
        state={state}
        progressListener={progress}
      ></PlayerWaveContainer>
      <img className='background' src={music && music.image}></img>
      {BGLayer}
    </div>
  )
}

export default PlayerButtonComponent
