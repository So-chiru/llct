import { RootState } from '@/store'
import { songsByIdRange } from '@/utils/songs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PlaylistCardComponent from './component'

interface PlaylistCardProps {
  query?: string
  item?: MusicPlaylist
  foldable?: boolean
}

export const PlaylistCard = ({
  query,
  item,
  foldable = true
}: PlaylistCardProps) => {
  // TODO : 플레이리스트 찾는 로직 구현

  const songs = useSelector((state: RootState) => state.songs).items

  if (!songs) {
    return <></>
  }

  if (!item && query) {
    // TODO : 플레이리스트 찾기
  }

  const [folded, setFolded] = useState<boolean>(true)

  const onFoldStateChange = () => {
    setFolded(!folded)
  }

  if (!item) {
    return <PlaylistCardComponent skeleton></PlaylistCardComponent>
  }

  return (
    <PlaylistCardComponent
      item={item}
      foldable={foldable}
      folded={folded}
      onFoldStateChange={onFoldStateChange}
    ></PlaylistCardComponent>
  )
}

export default PlaylistCard
