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

export const addItem = (name: string, data: string | string[]) => {
  return {
    type: '@llct/playlists/addItem',
    data: {
      name,
      data
    }
  }
}

export const removeItem = (name: string, index: number) => {
  return {
    type: '@llct/playlists/removeItem',
    data: {
      name,
      index
    }
  }
}

export const moveItems = (name: string, items: MusicMetadataWithID[]) => {
  return {
    type: '@llct/playlists/moveItems',
    data: {
      name,
      items
    }
  }
}

export const changeMetadata = (
  name: string,
  field: keyof MusicPlaylistBase,
  data: string
) => {
  return {
    type: '@llct/playlists/changeMetadata',
    data: {
      name,
      field,
      data
    }
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
  changeMetadata,
  setAddTo
}

export default playlistActions
