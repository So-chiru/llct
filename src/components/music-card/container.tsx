import { RootState } from '@/store'
import React from 'react'

import { useSelector } from 'react-redux'

import MusicCardComponent from './component'

import * as songs from '@/utils/songs'
interface MusicCardContainerProps {
  id?: string
  music?: MusicMetadata
  skeleton?: boolean
}

const MusicCardContainer = ({
  id,
  music,
  skeleton
}: MusicCardContainerProps) => {
  if (skeleton) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  const data = useSelector((state: RootState) => state.songs)

  let selectedMetadata: MusicMetadata | null = null

  if (music) {
    selectedMetadata = music
  } else if (data.items && id) {
    selectedMetadata = songs.searchById(id, data.items)
  }

  if (!selectedMetadata) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  return <MusicCardComponent music={selectedMetadata}></MusicCardComponent>
}

export default MusicCardContainer
