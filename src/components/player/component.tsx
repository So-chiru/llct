import { useEffect, useMemo, useState } from 'react'
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
import SliderComponent from '../slider/component'

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

const toggleScrollbar = (on: boolean) => {
  document.documentElement.style.overflow = on ? 'unset' : 'hidden'
}

import { emptyCover } from '@/utils/cover'

const UpNext = <UpNextComponent></UpNextComponent>
const Equalizer = <EqualizerComponent></EqualizerComponent>

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

  const [playerNarrow, setPlayerNarrow] = useState<boolean>(false)
  const showPlayer = useSelector((state: RootState) => state.ui.player.show)
  const usePlayerColor = useSelector(
    (state: RootState) => state.settings.usePlayerColor.value
  )

  const useTranslatedTitle = useSelector(
    (state: RootState) => state.settings.useTranslatedTitle.value
  )

  const useAlbumCover = useSelector(
    (state: RootState) => state.settings.useAlbumCover.value
  )

  requestAnimationFrame(() => {
    toggleScrollbar(!showPlayer)
  })

  useEffect(() => {
    // positions.css : $desktop
    const media = window.matchMedia('screen and (max-width: 1240px)')
    media.addEventListener('change', ev => {
      setPlayerNarrow(ev.matches)
    })

    if (playerNarrow !== media.matches) {
      setPlayerNarrow(media.matches)
    }
  }, [])

  const closePlayer = () => {
    dispatch(ui.showPlayer(false))
  }

  const showString = showPlayer ? ' show' : ''

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

  return (
    <>
      <div
        className={'llct-player-background' + showString}
        onClick={closePlayer}
      ></div>
      <div
        className={'llct-player' + showString}
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
        aria-hidden={!showPlayer}
      >
        <div
          className='close'
          role='button'
          aria-label='플레이어 닫기'
          onKeyPress={ev => ev.code === 'Enter' && closePlayer()}
        >
          {playerNarrow ? (
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
        <div className='contents'>
          <div className='dashboard'>
            <div className='dashboard-column metadata-zone'>
              {useMemo(
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
                    <h3
                      className='artist'
                      title={music.artist as string}
                      tabIndex={301}
                    >
                      {music.artist}
                    </h3>
                  </div>
                ),
                [music]
              )}
              <div className='controls'>
                {state.playState === MusicPlayerState.Playing ? (
                  <MdPause
                    tabIndex={302}
                    onClick={() => controller.pause()}
                    aria-label={'일시 정지'}
                    role='button'
                  ></MdPause>
                ) : (
                  <MdPlayArrow
                    tabIndex={302}
                    onClick={() => controller.play()}
                    aria-label={'재생'}
                    role='button'
                  ></MdPlayArrow>
                )}
                <MdSkipPrevious
                  tabIndex={302}
                  onClick={() => controller.prev()}
                  aria-label={'이전 곡으로 넘어가기'}
                  role='button'
                ></MdSkipPrevious>
                <MdSkipNext
                  tabIndex={302}
                  onClick={() => controller.next()}
                  aria-label={'다음 곡으로 넘어가기'}
                  role='button'
                ></MdSkipNext>
                <MdEqualizer
                  tabIndex={302}
                  onClick={() => controller.toggleEQ()}
                  aria-label={'오디오 효과 보기'}
                  role='button'
                ></MdEqualizer>
              </div>
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
            <div className='dashboard-column progress-zone'>
              {instance && (
                <ProgressBarComponent
                  progress={() => instance.progress}
                  duration={instance.duration}
                  color={(usePlayerColor && sliderColor) || undefined}
                  update={
                    state.playState === MusicPlayerState.Playing && showPlayer
                  }
                  seek={controller.seek}
                  tabIndex={400}
                ></ProgressBarComponent>
              )}
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
              </div>
            )}
            <div className='dashboard-column upnext-zone'>
              <h1 className='column-title'>재생 대기열</h1>
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
                  current={() => (!instance ? 0 : instance.timecode)}
                  lastSeek={state.lastSeek}
                  seek={(time: number) =>
                    instance && controller.seek(time / 100 / instance.duration)
                  }
                  id={music.id}
                ></CallContainer>
              ),
              [music.id, instance, state.playState, state.lastSeek]
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
