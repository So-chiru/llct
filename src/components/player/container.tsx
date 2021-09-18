import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { MusicPlayerState } from '@/@types/state'

import PlayerComponent from './component'
import {
  play,
  skip,
  setPlayState,
  setAlbumColor,
  playPlaylist
} from '@/store/player/actions'
import { searchById, audioURL } from '@/utils/songs'

import * as api from '@/api'

interface PlayerRouterState {
  closePlayer?: boolean
  id?: string
}

// 모두 리펙토링
const PlayerContainer = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [eqVisible, setEQVisible] = useState<boolean>(false)
  const [lastSeek, setLastSeek] = useState<number>(0)

  const playing = useSelector((state: RootState) => state.playing)
  const songs = useSelector((state: RootState) => state.songs.items)

  useEffect(() => {
    const data =
      playing.mode === 'queue'
        ? playing.queue[playing.pointer]
        : playing.playlist?.items[playing.playlistPointer]

    if (!data) {
      dispatch(setAlbumColor(null))
      return
    }

    api.fetchColorData(data.id).then(v => {
      dispatch(setAlbumColor(v))
    })

    document.title = `${data.title} - ${data.artist}`

    return () => {
      document.title = 'LLCT'
    }
  }, [
    playing.mode,
    playing.queue[playing.pointer],
    playing.playlist?.items[playing.playlistPointer]
  ])

  useEffect(() => {
    if (!songs) {
      return
    }

    // 플레이어가 최초로 로딩되었고, URL에 /play/ 가 있는 경우
    const search = new URL('https://a' + history.location.search)
    if (search.searchParams.has('id')) {
      let id = search.searchParams.get('id')!

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
    (playing.mode !== 'queue' || playing.pointer !== -1) &&
    playing.instance
  ) {
    let data: MusicMetadataWithID

    if (playing.mode === 'queue') {
      data = playing.queue[playing.pointer]
    } else {
      data = playing.playlist!.items[playing.playlistPointer]
    }

    if (data && playing.instance.src !== audioURL(data.id)) {
      playing.instance.load(audioURL(data.id))
    }
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
      if (
        playing.mode === 'playlist' &&
        !playing.playlistPointer &&
        playing.queue.length
      ) {
        dispatch(play(null, Math.max(0, playing.pointer)))
      } else {
        dispatch(skip(-1))
      }

      requestAnimationFrame(() => {
        if (playing.state.player === MusicPlayerState.Playing) {
          playing.instance!.play()
        }
      })
    },

    next: () => {
      if (
        playing.mode === 'queue' &&
        playing.pointer === playing.queue.length - 1 &&
        playing.playlist
      ) {
        dispatch(playPlaylist(null, Math.max(0, playing.playlistPointer)))
      } else {
        dispatch(skip(1))
      }

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
      music={
        playing.mode === 'queue'
          ? playing.queue[playing.pointer]
          : playing.playlist!.items[playing.playlistPointer]
      }
      color={playing.color}
      instance={playing.instance}
      lastSeek={lastSeek}
      playState={playing.state.player}
      showEQ={eqVisible}
      controller={controller}
    ></PlayerComponent>
  )
}

export default PlayerContainer
