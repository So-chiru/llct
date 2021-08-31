import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import '@/styles/tabs/songs.scss'

import { RootState } from '@/store'
import GroupCardComponent from '@/components/group-card/component'
import MusicCardContainer from '@/components/music-card/container'
import EmptyComponent from '@/components/empty/component'

import useInfiniteScroll from 'react-infinite-scroll-hook'
import { concatClass } from '@/utils/react'
import TouchScroller from '@/components/controls/touchScroller/container'
import { TouchScrollerDirection } from '@/core/ui/touch_scroller'
import {
  addSelectedItems,
  removeSelectedItems,
  setSelectionMode
} from '@/store/songs/actions'
import { SongsSelectionMode } from '@/store/songs/reducer'
import ButtonComponent from '@/components/controls/button/component'
import { updateTab } from '@/store/ui/actions'
import { findTabById } from '@/store/ui/reducer'

const DEFAULT_VIEW_SIZE = 6

const checkHasNextPage = (a: MusicMetadata[], b?: MusicMetadata[]) => {
  return typeof b !== 'undefined' && a.length !== b.length
}

const loadMore = (
  songs: MusicMetadata[],
  prevArr: MusicMetadata[],
  startCursor = 0
) => {
  let arr = prevArr

  arr = [
    ...prevArr,
    ...songs.slice(startCursor, startCursor + DEFAULT_VIEW_SIZE)
  ]

  return arr
}

const SongsTab = ({ show }: LLCTTabProps) => {
  const dispatch = useDispatch()

  const songs = useSelector((state: RootState) => state.songs)
  const [active, setActive] = useState<number>(1)

  const [loading, setLoading] = useState<boolean>(true)
  const [songItems, setSongItems] = useState<MusicMetadata[]>([])

  const groupClick = (index: number) => {
    setActive(index)
  }

  useEffect(() => {
    if (!songItems.length && songs.items && songs.items.songs) {
      setSongItems(songs.items.songs[active].slice(0, DEFAULT_VIEW_SIZE))
      setLoading(false)
    }
  }, [songs.items])

  useEffect(() => {
    setSongItems([])
  }, [active])

  const hasNextPage = checkHasNextPage(
    songItems,
    songs.items?.songs && songs.items?.songs[active]
  )

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage: hasNextPage,
    onLoadMore: () => {
      setLoading(true)

      if (hasNextPage && songs.items && songs.items.songs) {
        const arr = loadMore(
          songs.items.songs[active],
          songItems,
          songItems.length
        )
        setSongItems(arr)
        setLoading(false)
      }
    },
    disabled: !songs.load,
    rootMargin: '0px 0px 400px 0px'
  })

  const selectSongs = (id: string) => {
    if (songs.selectedItems.filter(v => v === id).length > 0) {
      dispatch(removeSelectedItems(id))

      return
    }

    dispatch(addSelectedItems(id))
  }

  const selectionDone = () => {
    dispatch(setSelectionMode(SongsSelectionMode.Default))
    dispatch(updateTab(findTabById('playlists')!))
  }

  if (!songs.items || !songs.items.groups || !songs.items.songs) {
    return (
      <div className={concatClass('llct-tab', show && 'show')}>
        <EmptyComponent
          text={songs.error ?? '노래를 불러올 수 없어요.'}
          height='30vh'
        ></EmptyComponent>
      </div>
    )
  }

  return (
    <div
      className={concatClass('llct-tab', show && 'show')}
      ref={rootRef}
      aria-hidden={!show}
    >
      {songs.selectionMode === SongsSelectionMode.AddPlaylist && (
        <div className='songs-action-box'>
          <h3>
            {songs.selectedItems.length
              ? `${songs.selectedItems.length}개가 선택 되었습니다.`
              : `플레이리스트에 들어갈 곡을 선택하세요.`}
          </h3>
          <ButtonComponent onClick={selectionDone}>선택 완료</ButtonComponent>
        </div>
      )}
      <TouchScroller direction={TouchScrollerDirection.Horizonal}>
        <div className='songs-groups-wrapper'>
          {...songs.items.groups.map((value, index) => {
            return (
              <GroupCardComponent
                key={`group:${index}`}
                index={index}
                group={value}
                active={active == index}
                click={groupClick}
              ></GroupCardComponent>
            )
          })}
        </div>
      </TouchScroller>
      {!songs.items.songs[active].length ? (
        <EmptyComponent text='텅 비었어요...' height='30vh'></EmptyComponent>
      ) : null}
      <div className='songs-list-wrapper'>
        {songItems.map((value, index) => {
          return (
            <MusicCardContainer
              key={`songs:${active}:${index}:${show}`}
              music={value}
              active={
                songs.selectedItems.filter(v => v === `${active}${index + 1}`)
                  .length > 0
              }
              group={active}
              index={index + 1}
              onClick={songs.selectionMode === 1 ? selectSongs : undefined}
            ></MusicCardContainer>
          )
        })}
        {...[0, 0, 0].map((_, index) => {
          if (loading || hasNextPage) {
            return (
              <div
                key={index}
                className='music-card'
                data-skeleton={true}
                ref={infiniteRef}
              ></div>
            )
          }
        })}
      </div>
    </div>
  )
}

export default SongsTab
