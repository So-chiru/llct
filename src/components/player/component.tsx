import { useEffect, useState } from 'react'
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
  instance: LLCTAudioStack
  controller: PlayerController
}

const toggleScrollbar = (on: boolean) => {
  document.documentElement.style.overflow = on ? 'unset' : 'hidden'
}

const UpNext = <UpNextComponent></UpNextComponent>
const Equalizer = <EqualizerComponent></EqualizerComponent>

const PlayerComponent = ({
  music = {
    id: '',
    title: 'Loading',
    artist: 'Loading',
    image: ''
  },
  state,
  instance,
  showEQ,
  controller
}: PlayerComponentProps) => {
  const dispatch = useDispatch()

  const [playerNarrow, setPlayerNarrow] = useState<boolean>(false)
  const showPlayer = useSelector((state: RootState) => state.ui.player.show)

  toggleScrollbar(!showPlayer)

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

  return (
    <>
      <div
        className={'llct-player-background' + showString}
        onClick={closePlayer}
      ></div>
      <div className={'llct-player' + showString}>
        <div className='close'>
          {playerNarrow ? (
            <MdKeyboardArrowDown onClick={closePlayer}></MdKeyboardArrowDown>
          ) : (
            <MdKeyboardArrowLeft onClick={closePlayer}></MdKeyboardArrowLeft>
          )}
        </div>
        <div className='contents'>
          <div className='dashboard'>
            <div className='dashboard-column metadata-zone'>
              <div className='texts'>
                <h1 className='title' title={music.title}>
                  {music.title}
                </h1>
                <h3 className='artist' title={music.artist as string}>
                  {music.artist}
                </h3>
              </div>
              <div className='controls'>
                {state.playState === MusicPlayerState.Playing ? (
                  <MdPause onClick={() => controller.pause()}></MdPause>
                ) : (
                  <MdPlayArrow onClick={() => controller.play()}></MdPlayArrow>
                )}
                <MdSkipPrevious
                  onClick={() => controller.prev()}
                ></MdSkipPrevious>
                <MdSkipNext onClick={() => controller?.next()}></MdSkipNext>
                <MdEqualizer
                  onClick={() => controller.toggleEQ()}
                ></MdEqualizer>
              </div>
              <div className='image'>
                <img
                  alt={`${music.title} 앨범 커버`}
                  src={typeof music !== 'undefined' ? music.image : ''}
                ></img>
              </div>
            </div>
            <div className='dashboard-column progress-zone'>
              <ProgressBarComponent
                progress={() => instance.progress}
                duration={instance.duration || 1}
                update={
                  state.playState === MusicPlayerState.Playing && showPlayer
                }
                seek={controller.seek}
              ></ProgressBarComponent>
            </div>
            {showEQ && (
              <div className='dashboard-column equalizer-zone'>
                <h1 className='column-title'>음향 효과</h1>
                {Equalizer}
                <SliderComponent
                  onSeek={(seek: number) => {
                    instance.volume = seek
                  }}
                  format={(num: number) => Math.floor(num) + '%'}
                  defaults={instance.volume}
                  step={0.05}
                  max={100}
                ></SliderComponent>
              </div>
            )}
            <div className='dashboard-column upnext-zone'>
              <h1 className='column-title'>재생 대기열</h1>
              {UpNext}
            </div>
          </div>
          <div className='lyrics'>
            <CallContainer
              update={
                state.playState === MusicPlayerState.Playing && showPlayer
              }
              current={() => instance.timecode}
              lastSeek={state.lastSeek}
              id={music.id}
            ></CallContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
