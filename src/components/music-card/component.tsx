import '@/styles/components/music-card/music-card.scss'
import { useState, useRef } from 'react'
import LazyLoad from 'react-lazyload'

import * as songs from '@/utils/songs'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
interface MusicCardProps {
  music?: MusicMetadata
  group?: number
  ref?: unknown
  index?: number
  skeleton?: boolean
  onClick?: () => void
  onContext?: (ev: MouseEvent) => void
}

enum ImageLoadState {
  Loading,
  Loaded,
  Failed
}

import { emptyCover } from '@/utils/cover'

const emptyFunction = () => {}

const tiltCardEnter = (ref: HTMLDivElement | null) => {
  if (!ref) {
    return
  }

  ref.classList.add('no-transition')
}

const tiltCardLeave = (ref: HTMLDivElement | null) => {
  if (!ref) {
    return
  }

  ref.classList.remove('no-transition')

  requestAnimationFrame(() => {
    ref.style.removeProperty('transform')
  })
}

const tiltCardElement = (
  ref: HTMLDivElement | null,
  ev: MouseEvent | TouchEvent,
  elemXY: number[]
) => {
  if (!ref) {
    return
  }

  requestAnimationFrame(() => {
    let x = 0
    if (ev instanceof MouseEvent && typeof ev.offsetX !== 'undefined') {
      x = ev.offsetX / elemXY[0]
    } else if (ev instanceof TouchEvent && ev.touches[0]) {
      x = (ev.touches[0].pageX - elemXY[2]) / elemXY[0]
    }

    let y = 0
    if (ev instanceof MouseEvent && typeof ev.offsetY !== 'undefined') {
      y = ev.offsetY / elemXY[1]
    } else if (ev instanceof TouchEvent && ev.touches[0]) {
      y = (ev.touches[0].pageY - elemXY[3]) / elemXY[1]
    }

    if (x > 1) {
      x = 1
    }

    if (y > 1) {
      y = 1
    }

    ref.style.transform = `scale(0.98) rotateX(${(
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
  onClick,
  onContext
}: MusicCardProps) => {
  const [loadState, setLoadState] = useState(ImageLoadState.Loading)

  const useTranslatedTitle = useSelector(
    (state: RootState) => state.settings.useTranslatedTitle.value
  )

  const useAlbumCover = useSelector(
    (state: RootState) => state.settings.useAlbumCover.value
  )

  const loadHandler = () => {
    setLoadState(ImageLoadState.Loaded)
  }

  const loadErrorHandler = () => {
    setLoadState(ImageLoadState.Failed)
  }

  const onKeyPress = (ev: KeyboardEvent) => {
    if (ev.code === 'Enter' && onClick) {
      onClick()
    }
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
    cardRef.current.oncontextmenu = onContext || emptyFunction
    cardRef.current.onkeypress = onKeyPress || emptyFunction
    cardRef.current.onmouseenter = () => tiltCardEnter(cardRef.current)
    cardRef.current.onmousemove = ev =>
      tiltCardElement(cardRef.current, ev, cardWidth)
    cardRef.current.onmouseleave = () => tiltCardLeave(cardRef.current)

    cardRef.current.ontouchstart = () => tiltCardEnter(cardRef.current)
    cardRef.current.ontouchmove = ev =>
      tiltCardElement(cardRef.current, ev, cardWidth)
    cardRef.current.ontouchend = () => tiltCardLeave(cardRef.current)
  }

  if (skeleton || !music) {
    return <div className='music-card' data-skeleton={true} ref={cardRef}></div>
  }

  const availableTitleText =
    useTranslatedTitle && music['title.ko'] ? music['title.ko'] : music.title

  return (
    <div
      className='music-card'
      data-skeleton={skeleton}
      ref={cardRef}
      role='button'
      tabIndex={1000}
      aria-label={music.artist + ' 의 ' + availableTitleText + ' 곡 카드.'}
    >
      <div className='content' data-state={loadState}>
        <LazyLoad height={100}>
          <img
            alt={`${availableTitleText || '노래'} 앨범 커버`}
            src={
              (useAlbumCover &&
                (music.image || songs.coverImageURL(group, index)) +
                  '?s=150') ||
              emptyCover
            }
            onLoad={loadHandler}
            onError={loadErrorHandler}
          ></img>
        </LazyLoad>
        <div className='metadata'>
          <p className='title'>{availableTitleText}</p>
          <p className='artist'>{music.artist}</p>
        </div>
      </div>
    </div>
  )
}

export default MusicCardComponent
