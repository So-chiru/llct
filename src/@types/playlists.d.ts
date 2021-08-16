interface MusicPlaylistCategory {
  title: string
  local?: boolean
  items: MusicPlaylist[]
}

interface MusicPlaylist {
  title: string
  description?: boolean
  lastEdit: number
  items: MusicMetadataWithID[]
}
