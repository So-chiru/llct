interface MusicPlaylistCategory {
  title: string
  local?: boolean
  items: MusicPlaylist[]
}

interface MusicPlaylist {
  title: string
  description?: string
  lastEdit: string
  items: MusicMetadataWithID[]
}
