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

export const addItem = (data: { name: string; data: string | string[] }) => {
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

export const moveItems = (data: {
  name: string
  items: MusicMetadataWithID[]
}) => {
  return {
    type: '@llct/playlists/moveItems',
    data
  }
}

export const setAddTo = (data: string | undefined) => {
  return {
    type: '@llct/playlists/addTo',
    data
  }
}

const playlistActions = {
  create,
  remove,
  load,
  addItem,
  removeItem,
  moveItems,
  setAddTo
}

export default playlistActions
