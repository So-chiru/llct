import '@/styles/components/music-card/music-card.scss'
import { useState } from 'react'
import LazyLoad from 'react-lazyload'

import * as songs from '@/utils/songs'
interface MusicCardProps {
  music?: MusicMetadata
  group?: number
  index?: number
  skeleton?: boolean
}

enum ImageLoadState {
  Loading,
  Loaded,
  Failed
}

const MusicCardComponent = ({
  music,
  skeleton,
  group,
  index
}: MusicCardProps) => {
  const [loadState, setLoadState] = useState(ImageLoadState.Loading)

  const loadHandler = () => {
    setLoadState(ImageLoadState.Loaded)
  }

  const loadErrorHandler = () => {
    setLoadState(ImageLoadState.Failed)
  }

  return skeleton || !music ? (
    <div className='music-card' data-skeleton={true}></div>
  ) : (
    <div className='music-card' data-skeleton={skeleton}>
      <div className='background-content'>
        <span className='artist'>{music.artist}</span>
      </div>
      <div className='content' data-state={loadState}>
        <LazyLoad height={100}>
          <img
            src={(music.image || songs.coverImageURL(group, index)) + '?s=150'}
            onLoad={loadHandler}
            onError={loadErrorHandler}
          ></img>
        </LazyLoad>
        <span className='title'>{music.title}</span>
      </div>
    </div>
  )
}

export default MusicCardComponent
