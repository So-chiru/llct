import { RootState } from '@/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PlaylistCardComponent from './component'

interface PlaylistCardProps {
  query?: string
  item?: MusicPlaylist
  foldable?: boolean
  onDelete?: (name: string) => void
  onValueChange?: (
    name: string,
    field: keyof MusicPlaylistBase,
    data: string
  ) => void
  onItemAdd?: (name: string) => void
  onItemRemove?: (name: string) => void
  onItemMove?: (name: string, items: MusicMetadataWithID[]) => void
}

export const PlaylistCard = ({
  query,
  item,
  foldable = true,
  onDelete,
  onValueChange,
  onItemAdd,
  onItemRemove,
  onItemMove
}: PlaylistCardProps) => {
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
      onValueChange={(field, value) =>
        onValueChange && onValueChange(item.title, field, value)
      }
      onDeleteClick={() => onDelete && onDelete(item.title)}
      onItemAddClick={() => onItemAdd && onItemAdd(item.title)}
      onItemRemoveClick={() => onItemRemove && onItemRemove(item.title)}
      onItemMove={(items: MusicMetadataWithID[]) =>
        onItemMove && onItemMove(item.title, items)
      }
    ></PlaylistCardComponent>
  )
}

export default PlaylistCard
