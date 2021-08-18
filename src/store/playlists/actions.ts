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

export const load = (data: MusicPlaylistData) => {
  return {
    type: '@llct/playlists/load',
    data
  }
}

export const addItem = (data: { name: string; data: string }) => {
  return {
    type: '@llct/playlists/addItem',
    data
  }
}

export const removeItem = (data: { name: string; index: number }) => {
  return {
    type: '@llct/playlists/removeItem',
    data
  }
}

const playlistActions = {
  create,
  remove,
  load,
  addItem,
  removeItem
}

export default playlistActions
