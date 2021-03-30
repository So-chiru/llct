import { RootState } from '@/store'
import React from 'react'

import { useSelector } from 'react-redux'

import MusicCardComponent from './component'

interface MusicCardContainerProps {
  id?: string
  music?: MusicMetadata
}

const MusicCardContainer = ({ id, music }: MusicCardContainerProps) => {
  const data = useSelector((state: RootState) => state.songs)

  console.log(data)

  let selectedMetadata: MusicMetadata

  if (music) {
    selectedMetadata = music
  } else if (id) {
    // TODO : ID 값으로 노래 찾기
    selectedMetadata = {
      title: 'Thank you, FRIENDS!!',
      artist: 'Aqours',
      image: 'https://api.lovelivec.kr/cover/10001'
    }
  } else {
    selectedMetadata = {
      title: 'Hi',
      artist: ArtistGroup.Aqours,
      image: 'https://api.lovelivec.kr/cover/10001'
    }
  }

  return <MusicCardComponent music={selectedMetadata}></MusicCardComponent>
}

export default MusicCardContainer
