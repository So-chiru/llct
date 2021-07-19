import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState } from '@/@types/state'

import PlayerComponent from './component'
import { play, skip, setPlayState, setAlbumColor } from '@/store/player/actions'
import { searchById, audioURL } from '@/utils/songs'

import * as api from '@/api'

interface PlayerRouterState {
  closePlayer?: boolean
  id?: string
}

const PlayerContainer = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [eqVisible, setEQVisible] = useState<boolean>(false)
  const [lastSeek, setLastSeek] = useState<number>(0)

  const playing = useSelector((state: RootState) => state.playing)
  const songs = useSelector((state: RootState) => state.songs.items)

  useEffect(() => {
    if (!playing.queue[playing.pointer]) {
      dispatch(setAlbumColor(null))
      return
    }

    api.fetchColorData(playing.queue[playing.pointer].id).then(v => {
      dispatch(setAlbumColor(v))
    })

    document.title = `${playing.queue[playing.pointer].title} - ${
      playing.queue[playing.pointer].artist
    }`

    return () => {
      document.title = 'LLCT'
    }
  }, [playing.queue[playing.pointer]])

  useEffect(() => {
    if (!songs) {
      return
    }

    // 플레이어가 최초로 로딩되었고, URL에 /play/ 가 있는 경우
    const search = new URL('https://a' + history.location.search)
    if (search.searchParams.has('id')) {
      let id = search.searchParams.get('id')

      if (
        history.location.state &&
        (history.location.state as PlayerRouterState).id
      ) {
        id = (history.location.state as PlayerRouterState).id || id
      }

      requestAnimationFrame(() => {
        dispatch(play(searchById(id, songs as LLCTSongDataV2)))
      })
    }
  }, [songs])

  if (
    playing.pointer !== -1 &&
    playing.instance &&
    playing.instance.src !== audioURL(playing.queue[playing.pointer]?.id)
  ) {
    playing.instance.load(audioURL(playing.queue[playing.pointer]?.id))
  }

  // 플레이어 컨트롤러 지정. 여기서 UI 동작을 수행했을 때 동작할 액션을 정의합니다.
  const controller: PlayerController = {
    play: () => {
      if (!playing.instance) {
        return
      }

      playing.instance.play()
      dispatch(setPlayState(MusicPlayerState.Playing))
    },
    pause: () => {
      if (!playing.instance) {
        return
      }

      playing.instance.pause()
      dispatch(setPlayState(MusicPlayerState.Paused))
    },
    seek: (seekTo: number) => {
      if (!playing.instance) {
        return
      }

      playing.instance.progress = seekTo
      setLastSeek(Date.now())
    },

    prev: () => {
      dispatch(skip(-1))

      requestAnimationFrame(() => {
        if (playing.state.player === MusicPlayerState.Playing) {
          playing.instance!.play()
        }
      })
    },

    next: () => {
      dispatch(skip(1))

      requestAnimationFrame(() => {
        if (playing.state.player === MusicPlayerState.Playing) {
          playing.instance!.play()
        }
      })
    },

    toggleEQ: () => {
      setEQVisible(!eqVisible)
    }
  }

  return (
    <PlayerComponent
      music={playing.queue[playing.pointer]}
      color={playing.color}
      instance={playing.instance}
      state={{
        playState: playing.state.player,
        loadState: playing.state.load,
        lastSeek
      }}
      showEQ={eqVisible}
      controller={controller}
    ></PlayerComponent>
  )
}

export default PlayerContainer
