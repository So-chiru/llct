import { useState } from 'react'

import '@/styles/components/player/player.scss'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdEqualizer,
  MdPause,
  MdPlayArrow
} from 'react-icons/md'
import { MusicPlayerState } from '@/@types/state'

interface PlayerComponentProps {
  show: boolean
  playState: MusicPlayerState
  music?: MusicMetadata
  clickOut: () => void
}

const PlayerComponent = ({
  music,
  playState,
  show,
  clickOut
}: PlayerComponentProps) => {
  const [playerNarrow, setPlayerNarrow] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(true)

  if (initial) {
    const media = window.matchMedia('screen and (max-width: 1240px)')
    media.addEventListener('change', ev => {
      setPlayerNarrow(ev.matches)
    })

    if (playerNarrow !== media.matches) {
      setPlayerNarrow(media.matches)
    }

    setInitial(false)
  }

  const play = () => {}

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
            <div className='metadata'>
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
                {playState === MusicPlayerState.Playing ? (
                  <MdPause></MdPause>
                ) : (
                  <MdPlayArrow></MdPlayArrow>
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
          </div>
          <div className='lyrics'></div>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
