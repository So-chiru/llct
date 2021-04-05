import React, { useState } from 'react'

import { useSelector } from 'react-redux'

import '@/styles/tabs/songs.scss'

import { RootState } from '@/store'
import GroupCardComponent from '@/components/group-card/component'
import MusicCardContainer from '@/components/music-card/container'

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
      <div className='songs-list-wrapper'>
        {...(songs.items.songs[active] || []).map((value, index) => {
          return (
            <MusicCardContainer
              key={`sonngs:${index}`}
              music={value}
            ></MusicCardContainer>
          )
        })}
      </div>
    </div>
  )
}

export default SongsTab
