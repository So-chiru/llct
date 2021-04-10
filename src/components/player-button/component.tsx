import '@/styles/components/player-button/player-button.scss'

import { MdMusicNote } from 'react-icons/md'
import { MusicPlayerState } from '@/@types/state'

import PlayerWaveContainer from '@/components/waves/player/container'

interface PlayerButtonProps {
  music: MusicMetadata
  state: MusicPlayerState
  show: boolean
  onClick: () => void
}

const PlayerButtonComponent = ({
  music,
  state,
  show,
  onClick
}: PlayerButtonProps) => {
  return (
    <div
      className={'llct-player-button' + (music && show ? ' show' : '')}
      data-state={state}
      onClick={onClick}
    >
      <PlayerWaveContainer show={show}></PlayerWaveContainer>
      <img className='background' src={music && music.image}></img>
      <div className='layer'>
        <MdMusicNote></MdMusicNote>
      </div>
    </div>
  )
}

export default PlayerButtonComponent
