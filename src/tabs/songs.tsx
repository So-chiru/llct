import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import '@/styles/tabs/songs.scss'

import { RootState } from '@/store'
import GroupCardComponent from '@/components/group-card/component'
import MusicCardContainer from '@/components/music-card/container'
import EmptyComponent from '@/components/empty/component'

import useInfiniteScroll from 'react-infinite-scroll-hook'
import { concatClass } from '@/utils/react'

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

  if (!songs.items || !songs.items.groups || !songs.items.songs) {
    return (
      <div className={concatClass('llct-tab', show && 'show')}>
        <EmptyComponent
          text='서버에 연결할 수 없나 봐요.'
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
      {!songs.items.songs[active].length ? (
        <EmptyComponent text='텅 비었어요...' height='30vh'></EmptyComponent>
      ) : null}
      <div className='songs-list-wrapper'>
        {songItems.map((value, index) => {
          return (
            <MusicCardContainer
              key={`songs:${active}:${index}:${show}`}
              music={value}
              group={active}
              index={index + 1}
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
