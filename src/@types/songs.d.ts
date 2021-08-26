interface LLCTSongDataV1 {
  [index: string]: unknown
}

interface MusicGroupMetadata {
  id: string
  name: string
  artists: string[]
  color: string
}

interface LLCTSongDataV2 {
  groups?: MusicGroupMetadata[]
  songs?: MusicMetadata[][]
}
interface MusicExtraMetadata {
  released?: number
  album?: string
  length?: number
  bpm?: number
  composer?: string[]
}
interface MusicMetadata {
  title: string
  'title.ko'?: string
  artist: string | number | number[] | ArtistGroup
  color?: {
    primary: string
    alternative: string
  }
  image: string
  metadata?: MusicExtraMetadata
}

interface MusicMetadataWithID extends MusicMetadata {
  id: string
}
