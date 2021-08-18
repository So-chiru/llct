import React from 'react'

import '@/styles/tabs/playlists.scss'
import ButtonComponent from '@/components/controls/button/component'
import EmptyComponent from '@/components/empty/component'
import PlaylistCard from '@/components/playlists/playlist-card/container'
import { songsByIdRange } from '@/utils/songs'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import playlistActions from '@/store/playlists/actions'
import playlistUtils from '@/utils/playlists'

const buildPlaylistCategories = (): MusicPlaylistCategory[] => {
  const songs = useSelector((state: RootState) => state.songs).items
  const playlists = useSelector((state: RootState) => state.playlists)

  return [
    {
      title: '내가 만든 플레이리스트',
      local: true,
      items:
        ((playlists.localItems &&
          songs &&
          ([
            ...playlists.localItems.playlists.map(v => ({
              ...v,
              items: [...songsByIdRange(songs, ...v.items)]
            }))
          ].filter(v => v !== undefined) as unknown)) as MusicPlaylist[]) || []
    },
    {
      title: '사이트에서 제공하는 플레이리스트',
      items:
        ((playlists.remoteItems &&
          songs &&
          ([
            ...playlists.remoteItems.playlists.map(v => ({
              ...v,
              items: [...songsByIdRange(songs, ...v.items)]
            }))
          ].filter(v => v !== undefined) as unknown)) as MusicPlaylist[]) || []
    }
  ]
}

interface PlaylistCategoryProps {
  item: MusicPlaylistCategory
}

const PlaylistCategory = ({ item }: PlaylistCategoryProps) => {
  const dispatch = useDispatch()

  const createPlaylist = () => {
    const name = prompt('플레이리스트 이름은 무엇으로 지을까요?')

    if (!name) {
      return
    }

    if (!playlistUtils.validateName(name)) {
      alert('플레이리스트 이름이 올바르지 않습니다. (1자 이상 64자 미만)')
      return
    }

    dispatch(playlistActions.create(name))
  }

  const deletePlaylist = (name: string) => {
    const proceed = confirm('정말로 플레이리스트를 삭제할까요?')

    if (!proceed) {
      return
    }

    dispatch(playlistActions.remove(name))
  }

  const loadPlaylist = () => {}

  return (
    <div className='category'>
      <span className='category-title'>{item.title}</span>
      <div className='category-items'>
        {!item.items.length && (
          <EmptyComponent
            text={`플레이리스트가 없어요.${
              item.local ? ' 만들어 볼까요?' : ''
            }`}
            height={'128px'}
          ></EmptyComponent>
        )}
        {item.items.map(v => (
          <PlaylistCard
            key={v.title}
            item={v}
            onDelete={deletePlaylist}
          ></PlaylistCard>
        ))}
        {item.local && (
          <div className='button-group'>
            <ButtonComponent onClick={loadPlaylist}>
              플레이리스트 불러오기
            </ButtonComponent>
            <ButtonComponent onClick={createPlaylist}>
              플레이리스트 만들기
            </ButtonComponent>
          </div>
        )}
      </div>
    </div>
  )
}

const PlaylistsTab = ({ show }: LLCTTabProps) => {
  const categories = buildPlaylistCategories()

  return (
    <div
      className={`llct-tab${show ? ' show' : ''} tab-playlists`}
      aria-hidden={!show}
    >
      <div className='categories'>
        {categories.map((v, i) => (
          <PlaylistCategory
            key={`playlist-category-${i}`}
            item={v}
          ></PlaylistCategory>
        ))}
      </div>
    </div>
  )
}

export default PlaylistsTab
