// TODO : 노래 목록 정리
interface LLCTSongDataV1 {
  [index: string]: unknown
}

interface MusicMetadata {
  title:
    | string
    | {
        ja: string
        ko?: string
      }
  artist: string | ArtistGroup
  image: string
}
