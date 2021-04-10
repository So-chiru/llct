import React, { useState } from 'react'

import { useSelector } from 'react-redux'

import '@/styles/tabs/songs.scss'

import { RootState } from '@/store'
import GroupCardComponent from '@/components/group-card/component'
import MusicCardContainer from '@/components/music-card/container'
import EmptyComponent from '@/components/empty/component'

const SongsTab = () => {
  const songs = useSelector((state: RootState) => state.songs)
  const [active, setActive] = useState<number>(1)

  if (!songs.items || !songs.items.groups || !songs.items.songs) {
    return <div className='llct-tab'></div>
  }

  const groupClick = (index: number) => {
    setActive(index)
  }

  return (
    <div className='llct-tab'>
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
        <EmptyComponent
          text='텅 비었어요...'
          height='30vh'
        ></EmptyComponent>
      ) : null}
      <div className='songs-list-wrapper'>
        {...(songs.items.songs[active] || []).map((value, index) => {
          return (
            <MusicCardContainer
              key={`songs:${index}`}
              music={value}
              group={active}
              index={index + 1}
            ></MusicCardContainer>
          )
        })}
      </div>
    </div>
  )
}

export default SongsTab
