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

const emptyFunction = () => {}

const textSizeCalculation = (x: number) => {
  return Math.max(18, Math.floor(Math.cos(x / 5) * 28))
}

const tiltCardElement = (
  ref: HTMLDivElement | null,
  ev: MouseEvent | TouchEvent,
  elemXY: number[]
) => {
  if (!ref) {
    return
  }

  ev.preventDefault()

  requestAnimationFrame(() => {
    let x = 0
    if (ev instanceof MouseEvent && ev.pageX) {
      x = (ev.pageX - elemXY[2]) / elemXY[0]
    } else if (ev instanceof TouchEvent && ev.touches[0]) {
      x = (ev.touches[0].pageX - elemXY[2]) / elemXY[0]
    }

    let y = 0
    if (ev instanceof MouseEvent && ev.pageX) {
      y = (ev.pageX - elemXY[3]) / elemXY[1]
    } else if (ev instanceof TouchEvent && ev.touches[0]) {
      y = (ev.touches[0].pageY - elemXY[3]) / elemXY[1]
    }

    if (x > 1) {
      x = 1
    }

    if (y > 1) {
      y = 1
    }

    ref.style.transform = `perspective(2000px) scale(0.98) rotateX(${(
      29 *
      (0.5 - y)
    ).toFixed(1)}deg) rotateY(${(2 * x).toFixed(1)}deg) rotateZ(${(
      -5 *
      (0.5 - x)
    ).toFixed(1)}deg)`
  })
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

  const cardRef = useRef<HTMLDivElement>(null)
  let cardWidth = [500, 300]

  if (cardRef.current) {
    const bound = cardRef.current.getBoundingClientRect()
    cardWidth = [bound.width, bound.height, bound.x, bound.y]

    /**
     * 호출 스택 줄이기 위해 React에서 제공하는 onMouseMove, Leave 대신 직접 이벤트를 부착하여 사용
     */
    cardRef.current.onclick = onClick || emptyFunction
    cardRef.current.onmousemove = ev =>
      tiltCardElement(cardRef.current, ev, cardWidth)
    cardRef.current.onmouseleave = () =>
      requestAnimationFrame(() => cardRef.current && cardRef.current.style.removeProperty('transform'))
    cardRef.current.ontouchmove = ev =>
      tiltCardElement(cardRef.current, ev, cardWidth)
    cardRef.current.ontouchend = () =>
      requestAnimationFrame(() => cardRef.current && cardRef.current.style.removeProperty('transform'))
  }

  return skeleton || !music ? (
    <div className='music-card' data-skeleton={true}></div>
  ) : (
    <div className='music-card' data-skeleton={skeleton} ref={cardRef}>
      <div className='background-content'>
        <span className='artist' ref={artistRef}>
          {music.artist}
        </span>
      </div>
      <div className='content' data-state={loadState}>
        <LazyLoad height={100}>
            <img
              alt={`${music.title || '노래'} 앨범 커버`}
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
