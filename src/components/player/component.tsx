import { useState } from 'react'

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

import ProgressBarComponent from '@/components/progress-bar/component'
import UpNextComponent from './upnext/container'
import EqualizerComponent from './equalizer/container'
import CallContainer from '../call/container'

interface PlayerComponentPropsState {
  playState?: MusicPlayerState
  loadState?: PlayerLoadState
  progress?: number
  duration?: number
  supportEffects?: boolean
}

interface PlayerComponentProps {
  show: boolean
  showEQ: boolean
  state: PlayerComponentPropsState
  callData?: LLCTCall | null
  music?: MusicMetadata
  controller?: PlayerController
  clickOut: () => void
}

const PlayerComponent = ({
  music,
  state,
  show,
  showEQ,
  callData,
  controller,
  clickOut
}: PlayerComponentProps) => {
  const [playerNarrow, setPlayerNarrow] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(true)

  if (initial) {
    // positions.css : $desktop
    const media = window.matchMedia('screen and (max-width: 1240px)')
    media.addEventListener('change', ev => {
      setPlayerNarrow(ev.matches)
    })

    if (playerNarrow !== media.matches) {
      setPlayerNarrow(media.matches)
    }

    setInitial(false)
  }

  return (
    <>
      <div
        className={'llct-player-background' + (show ? ' show' : '')}
        onClick={clickOut}
      ></div>
      <div className={'llct-player' + (show ? ' show' : '')}>
        <div className='close'>
          {playerNarrow ? (
            <MdKeyboardArrowDown onClick={clickOut}></MdKeyboardArrowDown>
          ) : (
            <MdKeyboardArrowLeft onClick={clickOut}></MdKeyboardArrowLeft>
          )}
        </div>
        <div className='contents'>
          <div className='dashboard'>
            <div className='dashboard-column metadata-zone'>
              <div className='texts'>
                <h1 className='title' title={music?.title}>
                  {music?.title}
                </h1>
                <h3
                  className='artist'
                  title={
                    typeof music?.artist === 'string'
                      ? music?.artist
                      : String(music?.artist)
                  }
                >
                  {music?.artist}
                </h3>
              </div>
              <div className='controls'>
                {state.playState === MusicPlayerState.Playing ? (
                  <MdPause onClick={() => controller?.pause()}></MdPause>
                ) : (
                  <MdPlayArrow onClick={() => controller?.play()}></MdPlayArrow>
                )}
                <MdSkipPrevious
                  onClick={() => controller?.prev()}
                ></MdSkipPrevious>
                <MdSkipNext onClick={() => controller?.next()}></MdSkipNext>
                <MdEqualizer
                  onClick={() => controller?.toggleEQ()}
                ></MdEqualizer>
              </div>
              <div className='image'>
                <img
                  alt={`${music?.title || '노래'} 앨범 커버`}
                  src={typeof music !== 'undefined' ? music.image : ''}
                ></img>
              </div>
            </div>
            <div className='dashboard-column progress-zone'>
              <ProgressBarComponent
                thumb={true}
                progress={state.progress}
                duration={state.duration}
                listen={
                  state.playState === MusicPlayerState.Playing && show
                    ? controller?.progress
                    : undefined
                }
                seek={controller?.seek}
              ></ProgressBarComponent>
            </div>
            {showEQ && (
              <div className='dashboard-column equalizer-zone'>
                <h1 className='column-title'>EQ</h1>
                <EqualizerComponent
                  supportEffects={state.supportEffects || false}
                ></EqualizerComponent>
              </div>
            )}
            <div className='dashboard-column upnext-zone'>
              <h1 className='column-title'>재생 대기열</h1>
              <UpNextComponent></UpNextComponent>
            </div>
          </div>
          <div className='lyrics'>
            {callData ? (
              <CallContainer
                data={callData}
                listen={
                  state.playState === MusicPlayerState.Playing && show
                    ? controller?.timecode
                    : undefined
                }
              ></CallContainer>
            ) : (
              <div className='no-call'>콜 데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
