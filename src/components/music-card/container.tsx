import { RootState } from '@/store'
import React from 'react'

import { useSelector } from 'react-redux'

import MusicCardComponent from './component'

import * as songs from '@/utils/songs'
interface MusicCardContainerProps {
  id?: string
  music?: MusicMetadata
  index?: number
  group?: number
  skeleton?: boolean
}

const MusicCardContainer = ({
  id,
  music,
  index,
  group,
  skeleton
}: MusicCardContainerProps) => {
  if (skeleton) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  const data = useSelector((state: RootState) => state.songs)

  let selectedMetadata: MusicMetadata | null = null

  if (music) {
    selectedMetadata = music

    if (typeof index !== 'undefined' && typeof group !== 'undefined') {
      selectedMetadata = songs.makeParsable(music, data.items, group, index)
    }
  } else if (data.items && id) {
    selectedMetadata = songs.searchById(id, data.items)
  } else if (
    data.items &&
    typeof index !== 'undefined' &&
    typeof group !== 'undefined'
  ) {
    selectedMetadata = songs.makeParsable(
      songs.searchById(`${group}${index}`, data.items),
      data.items,
      group,
      index
    )
  }

  if (!selectedMetadata) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  return (
    <MusicCardComponent
      music={selectedMetadata}
      group={group}
      index={index}
    ></MusicCardComponent>
  )
}

export default MusicCardContainer
