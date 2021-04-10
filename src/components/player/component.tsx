import { useState } from 'react'

import '@/styles/components/player/player.scss'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdEqualizer,
  MdPause,
  MdPlayArrow
} from 'react-icons/md'
import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

import ProgressBarComponent from '@/components/progress-bar/component'

interface PlayerComponentPropsState {
  playState?: MusicPlayerState
  loadState?: PlayerLoadState
  progress?: number
}

interface PlayerComponentProps {
  show: boolean
  state: PlayerComponentPropsState
  music?: MusicMetadata
  controller?: PlayerController
  clickOut: () => void
}

const PlayerComponent = ({
  music,
  state,
  show,
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
            <div className='metadata-zone'>
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
                <MdEqualizer></MdEqualizer>
              </div>
              <div className='image'>
                <img
                  alt={`${music?.title || '노래'} 앨범 커버`}
                  src={typeof music !== 'undefined' ? music.image : ''}
                ></img>
              </div>
            </div>
            <div className='progress-zone'>
              <ProgressBarComponent
                thumb={true}
                progress={controller?.progress()}
                listen={
                  state.playState === MusicPlayerState.Playing && show
                    ? controller?.progress
                    : undefined
                }
                seek={controller?.seek}
              ></ProgressBarComponent>
            </div>
          </div>
          <div className='lyrics'></div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
