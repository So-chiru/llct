import '@/styles/components/music-card/music-card.scss'
import { useState, useRef } from 'react'
import LazyLoad from 'react-lazyload'

import * as songs from '@/utils/songs'
interface MusicCardProps {
  music?: MusicMetadata
  group?: number
  index?: number
  skeleton?: boolean
  onClick?: () => void
}

enum ImageLoadState {
  Loading,
  Loaded,
  Failed
}

const textSizeCalculation = (x: number) => {
  return Math.max(18, Math.floor(Math.cos(x / 5) * 28))
}

const MusicCardComponent = ({
  music,
  skeleton,
  group,
  index,
  onClick
}: MusicCardProps) => {
  const [loadState, setLoadState] = useState(ImageLoadState.Loading)

  const loadHandler = () => {
    setLoadState(ImageLoadState.Loaded)
  }

  const loadErrorHandler = () => {
    setLoadState(ImageLoadState.Failed)
  }

  const artistRef = useRef<HTMLSpanElement>(null)

  if (artistRef.current && artistRef.current.innerText.length > 10) {
    artistRef.current.style.fontSize =
      textSizeCalculation(
        Math.max(0, artistRef.current.innerText.length) / 28
      ) + 'px'
  }

  return skeleton || !music ? (
    <div className='music-card' data-skeleton={true}></div>
  ) : (
    <div className='music-card' data-skeleton={skeleton} onClick={onClick}>
      <div className='background-content'>
        <span className='artist' ref={artistRef}>
          {music.artist}
        </span>
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
