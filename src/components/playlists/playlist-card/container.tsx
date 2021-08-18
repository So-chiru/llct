import { RootState } from '@/store'
import { songsByIdRange } from '@/utils/songs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PlaylistCardComponent from './component'

interface PlaylistCardProps {
  query?: string
  item?: MusicPlaylist
  foldable?: boolean
  onDelete?: (name: string) => void
}

export const PlaylistCard = ({
  query,
  item,
  foldable = true,
  onDelete
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
  const [editMode, setEditMode] = useState<boolean>(false)

  const onFoldStateChange = () => {
    setFolded(!folded)

    if (!folded) {
      setEditMode(false)
    }
  }

  const onEditStateChange = () => {
    setEditMode(!editMode)
  }

  if (!item) {
    return <PlaylistCardComponent skeleton></PlaylistCardComponent>
  }

  return (
    <PlaylistCardComponent
      item={item}
      editMode={editMode}
      foldable={foldable}
      folded={folded}
      onFoldStateChange={onFoldStateChange}
      onEditStateChange={onEditStateChange}
      onDeleteClick={() => onDelete && onDelete(item.title)}
    ></PlaylistCardComponent>
  )
}

export default PlaylistCard
