import '@/styles/components/music-card/music-card.scss'
import { useState } from 'react'

interface MusicCardProps {
  music: MusicMetadata
  skeleton?: boolean
}

enum ImageLoadState {
  Loading,
  Loaded,
  Failed
}

const MusicCardComponent = ({ music, skeleton }: MusicCardProps) => {
  const [loadState, setLoadState] = useState(ImageLoadState.Loading)

  const loadHandler = () => {
    setLoadState(ImageLoadState.Loaded)
  }

  const loadErrorHandler = () => {
    setLoadState(ImageLoadState.Failed)
  }

  return (
    <div className='music-card' data-skeleton={skeleton}>
      <div className='background-content'>
        <span className='artist'>{music.artist}</span>
      </div>
      <div className='content' data-state={loadState}>
        <img
          src={music.image}
          onLoad={loadHandler}
          onError={loadErrorHandler}
        ></img>
        <span className='title'>{music.title}</span>
      </div>
    </div>
  )
}

export default MusicCardComponent
