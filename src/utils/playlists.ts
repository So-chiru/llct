export const validateName = (name: unknown): name is string => {
  return typeof name === 'string' && name.length > 0 && name.length < 64
}

const newPlaylistData = (name: string): MusicPlaylistData => {
  return {
    title: name,
    lastEdit: new Date().toISOString(),
    items: []
  }
}

const checkExists = (state: LLCTPlaylistDataV1 | null, name: string) => {
  if (!state) {
    return false
  }

  for (let i = 0; i < state.playlists.length; i++) {
    if (state.playlists[i].title === name) {
      return true
    }
  }

  return false
}

const playlistUtils = {
  validateName,
  newPlaylistData,
  checkExists
}

export default playlistUtils
