import '@/styles/components/player-button/player-button.scss'

import MusicNote from '@material-ui/icons/MusicNote'

import { MusicPlayingState } from '@/@types/state'

import PlayerWaveContainer from '@/components/waves/player/container'

interface PlayerButtonProps {
  music: MusicMetadata
  state: MusicPlayingState
}

const PlayerButtonComponent = ({ music, state }: PlayerButtonProps) => {
  return (
    <div className='llct-player-button' data-state={state}>
      <PlayerWaveContainer></PlayerWaveContainer>
      <img className='background' src={music.image}></img>
      <div className='layer'>
        <MusicNote></MusicNote>
      </div>
    </div>
  )
}

export default PlayerButtonComponent
