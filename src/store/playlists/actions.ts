export interface PlaylistsReducerAction {
  type: string
  data?: unknown
  error?: unknown
}

export const create = (name: string): PlaylistsReducerAction => {
  return {
    type: '@llct/playlists/create',
    data: name
  }
}

export const remove = (name: string): PlaylistsReducerAction => {
  return {
    type: '@llct/playlists/remove',
    data: name
  }
}

const playlistActions = {
  create,
  remove
}

export default playlistActions
