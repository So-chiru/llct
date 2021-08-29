import '@/styles/components/player-button/player-button.scss'

import { useSelector } from 'react-redux'

import { MdMusicNote } from 'react-icons/md'
import { MusicPlayerState } from '@/@types/state'

import PlayerWaveContainer from '@/components/waves/player/container'

import { RootState } from '@/store/index'
import { emptyCover } from '@/utils/cover'

interface PlayerButtonProps {
  music: MusicMetadata
  state: MusicPlayerState
  show: boolean
  color?: LLCTColor
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
  color,
  progress,
  onClick
}: PlayerButtonProps) => {
  const useAlbumCover = useSelector(
    (state: RootState) => state.settings.useAlbumCover.value
  )

  return (
    <div
      className={'llct-player-button' + (music && show ? ' show' : '')}
      data-state={state}
      onClick={onClick}
    >
      <PlayerWaveContainer
        show={show}
        state={state}
        color={color && color.main}
        progressListener={progress}
      ></PlayerWaveContainer>
      <img
        className='background'
        src={useAlbumCover ? music && music.image : emptyCover}
      ></img>
      {BGLayer}
    </div>
  )
}

export default PlayerButtonComponent
