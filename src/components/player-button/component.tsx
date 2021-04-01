import '@/styles/components/player-button/player-button.scss'

import MusicNote from '@material-ui/icons/MusicNote'

interface PlayerButtonProps {
  music: MusicMetadata
}

const PlayerButtonComponent = ({ music }: PlayerButtonProps) => {
  return (
    <div className='llct-player-button' data-state="PLAYING">
      <div className='wave'></div>
      <img className='background' src={music.image}></img>
      <div className='layer'>
        <MusicNote></MusicNote>
      </div>
    </div>
  )
}

export default PlayerButtonComponent
