interface PlaylistsTypes {
  load: boolean
  remoteItems: LLCTPlaylistDataV1 | null
  localItems: LLCTPlaylistDataV1 | null
  error?: Error
}

const getSavedPlaylists = (): LLCTPlaylistDataV1 | null => {
  const saved = localStorage.getItem('@llct/api_playlists/local')

  if (!saved || saved[0] !== '{') {
    return null
  }

  const data = JSON.parse(saved)

  return data
}

const PlaylistsDefault: PlaylistsTypes = {
  load: false,
  localItems: getSavedPlaylists(),
  remoteItems: null
}

interface PlaylistsReducerAction {
  id: string
  type: string
  data?: Record<string, unknown>
  error?: unknown
}

const PlaylistsReducer = (
  state = PlaylistsDefault,
  action: PlaylistsReducerAction
): PlaylistsTypes => {
  switch (action.type) {
    case '@llct/api_playlists/request':
      return Object.assign({}, state, {
        load: true
      })
    case '@llct/api_playlists/success':
      return Object.assign({}, state, {
        load: true,
        items: action.data
      })
    case '@llct/api_playlists/failed':
      return Object.assign({}, state, {
        load: true,
        error: action.error
      })
    default:
      return state
  }
}

export default PlaylistsReducer
