interface MusicPlaylistCategory {
  title: string
  local?: boolean
  items: MusicPlaylist[]
}

interface MusicPlaylistBase {
  title: string
  description?: string
  lastEdit: string
}

interface MusicPlaylist extends MusicPlaylistBase {
  items: MusicMetadataWithID[]
}

interface MusicPlaylistData extends MusicPlaylistBase {
  items: string[]
}

interface LLCTPlaylistDataV1 {
  playlists: MusicPlaylistData[]
}
