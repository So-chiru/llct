import store from '@/core/store'
import playlistUtils from '@/utils/playlists'
import { PlaylistsReducerAction } from './actions'

interface PlaylistsTypes {
  remoteLoaded: boolean
  remoteItems: LLCTPlaylistDataV1 | null
  localItems: LLCTPlaylistDataV1 | null
  error?: Error
}

const getSavedPlaylists = (): LLCTPlaylistDataV1 | null => {
  const saved = store.get('playlists')

  // TODO : 로컬에 저장된 데이터 검증

  return saved
}

const storageSaveWrapper = (
  state: PlaylistsTypes,
  func: () => LLCTPlaylistDataV1 | null
): PlaylistsTypes => {
  const result = func()

  if (!result) {
    return state
  }

  store.set('playlists', result)

  return Object.assign({}, state, {
    localItems: result
  })
}

const PlaylistsDefault: PlaylistsTypes = {
  localItems: getSavedPlaylists(),
  remoteLoaded: false,
  remoteItems: null
}

const PlaylistsReducer = (
  state = PlaylistsDefault,
  action: PlaylistsReducerAction
): PlaylistsTypes => {
  switch (action.type) {
    case '@llct/playlists/create':
      return storageSaveWrapper(state, () => {
        if (!playlistUtils.validateName(action.data)) {
          return null
        }

        if (playlistUtils.checkExists(state.localItems, action.data)) {
          return null
        }

        const items: LLCTPlaylistDataV1 = state.localItems || {
          playlists: []
        }

        items.playlists.push(playlistUtils.newPlaylistData(action.data))

        return items
      })
    case '@llct/playlists/remove':
      return storageSaveWrapper(state, () => {
        if (
          !playlistUtils.checkExists(state.localItems, action.data as string)
        ) {
          return null
        }

        const items: LLCTPlaylistDataV1 = state.localItems || {
          playlists: []
        }

        items.playlists = items.playlists.filter(
          v => v.title !== (action.data as string)
        )

        return items
      })

    case '@llct/playlists/api/request':
      return Object.assign({}, state, {
        remoteLoaded: true
      })
    case '@llct/playlists/api/success':
      return Object.assign({}, state, {
        remoteLoaded: true,
        remoteItems: action.data
      })
    case '@llct/playlists/api/failed':
      return Object.assign({}, state, {
        remoteLoaded: true,
        remoteItems: action.error
      })
    default:
      return state
  }
}

export default PlaylistsReducer
