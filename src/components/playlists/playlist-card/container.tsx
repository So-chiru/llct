import { RootState } from '@/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PlaylistCardComponent from './component'

interface PlaylistCardProps {
  query?: string
  item?: MusicPlaylist
  foldable?: boolean
  editable?: boolean
  onDelete?: (name: string) => void
  onValueChange?: (
    name: string,
    field: keyof MusicPlaylistBase,
    data: string
  ) => void
  onItemAdd?: (name: string) => void
  onItemRemove?: (name: string, index: number) => void
  onItemMove?: (name: string, items: MusicMetadataWithID[]) => void
  onPlay?: (item: MusicPlaylist) => void
}

export const PlaylistCard = ({
  query,
  item,
  foldable = true,
  editable = true,
  onDelete,
  onValueChange,
  onItemAdd,
  onItemRemove,
  onItemMove,
  onPlay,
}: PlaylistCardProps) => {
  // const songs = useSelector((state: RootState) => state.songs).items

  // if (!songs) {
  //   return <></>
  // }

  // if (!item && query) {
  //   // TODO : 플레이리스트 찾기
  // }

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
      editable={editable}
      folded={folded}
      onFoldStateChange={onFoldStateChange}
      onEditStateChange={onEditStateChange}
      onValueChange={(field, value) =>
        onValueChange && onValueChange(item.title, field, value)
      }
      onDeleteClick={() => onDelete && onDelete(item.title)}
      onItemAddClick={() => onItemAdd && onItemAdd(item.title)}
      onItemRemoveClick={index =>
        onItemRemove && onItemRemove(item.title, index)
      }
      onItemMove={(items: MusicMetadataWithID[]) =>
        onItemMove && onItemMove(item.title, items)
      }
      onPlayClick={() => onPlay && onPlay(item)}
    ></PlaylistCardComponent>
  )
}

export default PlaylistCard
