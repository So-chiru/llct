import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/components/player/player.scss'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdEqualizer,
  MdPause,
  MdPlayArrow,
  MdSkipPrevious,
  MdSkipNext
} from 'react-icons/md'
import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

import ProgressBarComponent from '@/components/progress-bar/container'
import UpNextComponent from './upnext/container'
import EqualizerComponent from './equalizer/container'
import CallContainer from '../call/container'
import * as ui from '@/store/ui/actions'

import { RootState } from '@/store/index'
import SliderComponent from '../controls/slider/component'

interface PlayerComponentPropsState {
  playState?: MusicPlayerState
  loadState?: PlayerLoadState
  lastSeek: number
}

interface PlayerComponentProps {
  showEQ: boolean
  state: PlayerComponentPropsState
  music: MusicMetadataWithID
  instance?: LLCTAudioStack
  controller: PlayerController
  color: LLCTColor | null
}

const SHOW_MINI_PLAYER_AFTER = 230

let lastScrollY = 0

const toggleScrollbar = (on: boolean) => {
  document.documentElement.style.overflow = on ? 'unset' : 'hidden'

  if (!on) {
    lastScrollY = window.scrollY
  }

  document.documentElement.style.position = on ? 'unset' : 'fixed'

  if (on && lastScrollY) {
    window.scrollTo({
      top: lastScrollY
    })

    lastScrollY = 0
  }
}

import { emptyCover } from '@/utils/cover'
import TouchSlider, { TouchDirection } from '@/core/ui/touch_slide'
import { concatClass } from '@/utils/react'
import { PlayerBannerComponent } from './banner/component'
import TouchScroller from '../controls/touchScroller/container'
import { TouchScrollerDirection } from '@/core/ui/touch_scroller'
import PlayerBannerContainer from './banner/container'

const UpNext = <UpNextComponent></UpNextComponent>
const Equalizer = <EqualizerComponent></EqualizerComponent>

const usePlayerSettings = () => {
  const usePlayerColor = useSelector(
    (state: RootState) => state.settings.usePlayerColor.value
  )

  const useTranslatedTitle = useSelector(
    (state: RootState) => state.settings.useTranslatedTitle.value
  )

  const useAlbumCover = useSelector(
    (state: RootState) => state.settings.useAlbumCover.value
  )

  return [usePlayerColor, useTranslatedTitle, useAlbumCover]
}

const useNarrowPlayer = () => {
  const [narrow, setNarrow] = useState<boolean>(false)

  useEffect(() => {
    // positions.css : $desktop
    const media = window.matchMedia('screen and (max-width: 1240px)')
    media.addEventListener('change', ev => {
      setNarrow(ev.matches)
    })

    if (narrow !== media.matches) {
      setNarrow(media.matches)
    }
  }, [])

  return narrow
}

const useTouchSlider = (
  target: HTMLElement,
  player: HTMLElement,
  over: () => void
) => {
  const [touchHandler, setTouchHandler] = useState<TouchSlider>()

  useEffect(() => {
    if (!target || !player) {
      return
    }

    let slider: TouchSlider

    if (!touchHandler) {
      slider = new TouchSlider(target, {
        direction: TouchDirection.Vertical
      })

      slider.events.on('start', () => {
        player.classList.add('player-handle-touch')
      })

      slider.events.on('move', (px: number) => {
        requestAnimationFrame(() => {
          player.setAttribute('style', `--player-pull: ${Math.max(-50, px)}px`)
        })
      })

      slider.events.on('end', (thresholdOver: boolean) => {
        player.classList.remove('player-handle-touch')

        requestAnimationFrame(() => {
          player.removeAttribute('style')
        })

        if (thresholdOver) {
          over()
        }
      })

      setTouchHandler(slider)
      return
    }

    return () => {
      if (slider) {
        slider.destroy()
      }
    }
  }, [target, player])

  return undefined
}

const CallBanners = () => {
  const call = useSelector((state: RootState) => state.call)

  if (!call.load || !call.data || !call.data.metadata) {
    return <></>
  }

  if (call.data.metadata.flags || call.data.metadata.blade) {
    return (
      <TouchScroller direction={TouchScrollerDirection.Horizonal}>
        <div className='player-banner-wrapper'>
          {
            ([
              typeof call.data.metadata.blade === 'object' && (
                <PlayerBannerComponent
                  key={'banner'}
                  title={'블레이드 추천 색상'}
                  color={call.data.metadata.blade.color}
                  description={
                    call.data.metadata.blade.text ?? '추천 색상 없음'
                  }
                ></PlayerBannerComponent>
              ),
              call.data.metadata.flags && [
                ...Object.keys(call.data.metadata.flags).map(v => {
                  if (
                    call.data &&
                    call.data.metadata.flags &&
                    call.data.metadata.flags[
                      v as keyof LLCTCallMetadata['flags']
                    ]
                  ) {
                    return (
                      <PlayerBannerContainer
                        key={`banner-${v}`}
                        id={v as keyof LLCTCallMetadata['flags']}
                      ></PlayerBannerContainer>
                    )
                  }

                  return <></>
                })
              ]
            ] as unknown[]) as ReactNode
          }
        </div>
      </TouchScroller>
    )
  }

  return <></>
}

const PlayerComponent = ({
  music = {
    id: '',
    title: 'Loading',
    artist: 'Loading',
    image: ''
  },
  color,
  state,
  instance,
  showEQ,
  controller
}: PlayerComponentProps) => {
  const dispatch = useDispatch()

  const showPlayer = useSelector((state: RootState) => state.ui.player.show)

  const closePlayer = () => {
    dispatch(ui.showPlayer(false))
  }

  const player = useRef<HTMLDivElement>(null)
  const closeArea = useRef<HTMLDivElement>(null)

  const [
    usePlayerColor,
    useTranslatedTitle,
    useAlbumCover
  ] = usePlayerSettings()

  const narrowPlayer = useNarrowPlayer()

  useTouchSlider(closeArea.current!, player.current!, () => {
    closePlayer()
  })

  requestAnimationFrame(() => {
    toggleScrollbar(!showPlayer)
  })

  const sliderColor = {
    background: color && color.main,
    track: color && color.text,
    thumb: color && color.text,
    backgroundDark: color && color.mainDark,
    trackDark: color && color.textDark,
    thumbDark: color && color.textDark
  }

  const availableTitleText =
    useTranslatedTitle && music['title.ko'] ? music['title.ko'] : music.title

  const titleInfo = useMemo(
    () => (
      <div className='texts'>
        <h1
          className='title'
          title={availableTitleText}
          aria-label={availableTitleText}
          tabIndex={300}
        >
          {availableTitleText}
        </h1>
        <h3 className='artist' title={music.artist as string} tabIndex={301}>
          {music.artist}
        </h3>
      </div>
    ),
    [music]
  )

  // TODO : hook으로 리펙토링
  const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(false)
  const playerContents = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (playerContents.current!.scrollTop > SHOW_MINI_PLAYER_AFTER) {
        setShowMiniPlayer(true)
      } else {
        setShowMiniPlayer(false)
      }
    }

    playerContents.current?.addEventListener('scroll', onScroll)

    return () => {
      playerContents.current?.removeEventListener('scroll', onScroll)
    }
  }, [playerContents])

  // 플레이어 영역 클릭시 맨 위로 이동
  const [lastGoTopButtonClick, setLastGoTopButtonClick] = useState<number>(0)

  useEffect(() => {
    const onClick = () => {
      setLastGoTopButtonClick(Date.now() + 5000)
      playerContents.current!.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    closeArea.current?.addEventListener('click', onClick)
    closeArea.current?.addEventListener('pointerup', onClick)

    return () => {
      closeArea.current?.removeEventListener('click', onClick)
      closeArea.current?.addEventListener('pointerup', onClick)
    }
  }, [closeArea])

  const ProgressBar = instance && (
    <ProgressBarComponent
      progress={() => instance.progress}
      duration={instance.duration}
      color={(usePlayerColor && sliderColor) || undefined}
      update={state.playState === MusicPlayerState.Playing && showPlayer}
      seek={controller.seek}
      tabIndex={400}
    ></ProgressBarComponent>
  )

  const Controls = (
    <div className='controls'>
      {state.playState === MusicPlayerState.Playing ? (
        <MdPause
          tabIndex={302}
          onClick={() => controller.pause()}
          aria-label={'일시 정지'}
          role='button'
          className='pause-button'
        ></MdPause>
      ) : (
        <MdPlayArrow
          tabIndex={302}
          onClick={() => controller.play()}
          aria-label={'재생'}
          role='button'
          className='play-button'
        ></MdPlayArrow>
      )}
      <MdSkipPrevious
        tabIndex={302}
        onClick={() => controller.prev()}
        aria-label={'이전 곡으로 넘어가기'}
        role='button'
        className='skipprevious-button'
      ></MdSkipPrevious>
      <MdSkipNext
        tabIndex={302}
        onClick={() => controller.next()}
        aria-label={'다음 곡으로 넘어가기'}
        role='button'
        className='skipnext-button'
      ></MdSkipNext>
      <MdEqualizer
        tabIndex={302}
        onClick={() => controller.toggleEQ()}
        aria-label={'오디오 효과 보기'}
        role='button'
        className='equalizer-button'
      ></MdEqualizer>
    </div>
  )

  return (
    <>
      <div
        className={concatClass('llct-player-background', showPlayer && 'show')}
        onClick={closePlayer}
      ></div>
      <div
        className={concatClass('llct-player', showPlayer && 'show')}
        style={
          (usePlayerColor && {
            ['--album-color' as string]: color && color.main,
            ['--album-color-second' as string]: color && color.sub,
            ['--album-color-text' as string]: color && color.text,
            ['--album-color-dark' as string]: color && color.mainDark,
            ['--album-color-second-dark' as string]: color && color.subDark,
            ['--album-color-text-dark' as string]: color && color.textDark
          }) ||
          undefined
        }
        ref={player}
        aria-hidden={!showPlayer}
      >
        <div
          className='close-area'
          role='button'
          aria-label='플레이어 닫기'
          onKeyPress={ev => ev.code === 'Enter' && closePlayer()}
          ref={closeArea}
        >
          {narrowPlayer ? (
            <MdKeyboardArrowDown
              id='player-close'
              onClick={closePlayer}
            ></MdKeyboardArrowDown>
          ) : (
            <MdKeyboardArrowLeft
              id='player-close'
              onClick={closePlayer}
            ></MdKeyboardArrowLeft>
          )}
        </div>
        <div className='contents' ref={playerContents}>
          <div
            className={concatClass('mini-player', showMiniPlayer && 'visible')}
          >
            <div className='left'>{Controls}</div>
            <div className='right'>{ProgressBar}</div>
          </div>
          <div className='dashboard'>
            <div className='dashboard-column metadata-zone'>
              {titleInfo}
              {Controls}
              <div className='image'>
                <img
                  alt={`${music.title} 앨범 커버`}
                  src={
                    useAlbumCover
                      ? typeof music !== 'undefined'
                        ? music.image
                        : ''
                      : emptyCover
                  }
                ></img>
              </div>
            </div>
            <div className='dashboard-column progress-zone'>{ProgressBar}</div>
            <div className='dashboard-column call-info-zone'>
              <CallBanners></CallBanners>
            </div>
            {showEQ && (
              <div className='dashboard-column equalizer-zone'>
                <h1 className='column-title'>음향 효과</h1>
                <div className='equalizer-lack'>{Equalizer}</div>
                <div className='equalizer-lack'>
                  <h3>볼륨</h3>
                  {instance && (
                    <SliderComponent
                      onSeek={(seek: number) => {
                        instance.volume = seek
                      }}
                      color={(usePlayerColor && sliderColor) || undefined}
                      format={(num: number) => Math.floor(num) + '%'}
                      defaults={instance.volume}
                      step={0.05}
                      max={100}
                    ></SliderComponent>
                  )}
                </div>
                <div className='equalizer-lack'>
                  <h3>재생 속도</h3>
                  {instance && (
                    <SliderComponent
                      onSeek={(seek: number) => {
                        instance.speed = seek * 2
                      }}
                      color={(usePlayerColor && sliderColor) || undefined}
                      format={(num: number) => num.toFixed(2) + 'x'}
                      defaults={instance.speed / 2}
                      step={0.05}
                      max={2}
                    ></SliderComponent>
                  )}
                </div>
              </div>
            )}
            <div className='dashboard-column upnext-zone' data-show={showEQ}>
              {UpNext}
            </div>
          </div>
          <div className='lyrics'>
            {useMemo(
              () => (
                <CallContainer
                  update={
                    state.playState === MusicPlayerState.Playing && showPlayer
                  }
                  current={() => instance?.timecode ?? 0}
                  lastSeek={Math.max(state.lastSeek, lastGoTopButtonClick)}
                  seek={(time: number) =>
                    instance && controller.seek(time / 100 / instance.duration)
                  }
                  id={music.id}
                ></CallContainer>
              ),
              [
                music.id,
                instance,
                state.playState,
                Math.max(state.lastSeek, lastGoTopButtonClick)
              ]
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
