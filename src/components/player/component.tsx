import { useState } from 'react'

import '@/styles/components/player/player.scss'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import {
  Equalizer,
  KeyboardArrowLeft,
  Pause,
  PlayArrow
} from '@material-ui/icons'
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
            <KeyboardArrowDownIcon onClick={clickOut}></KeyboardArrowDownIcon>
          ) : (
            <KeyboardArrowLeft onClick={clickOut}></KeyboardArrowLeft>
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
                  <Pause></Pause>
                ) : (
                  <PlayArrow></PlayArrow>
                )}
                <Equalizer></Equalizer>
              </div>
              <div className='image'>
                <img
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
