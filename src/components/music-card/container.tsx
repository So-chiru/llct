import { RootState } from '@/store'
import React from 'react'

import { useSelector } from 'react-redux'

import MusicCardComponent from './component'

interface MusicCardContainerProps {
  id?: string
  music?: MusicMetadata
}

const explaner = [
  '화난',
  '무심한',
  '시크한',
  '재미 없는',
  '아픈',
  '심심한',
  '열중하는',
  '잔잔한',
  '신난',
  '기분 좋은',
  '시큼한',
  '무지한',
  '생각 없는'
]
const namer = ['누군가', '사과', '바나나', '교수', '조교', '친구']

const generateRandomText = (): string => {
  return `${explaner[~~(Math.random() * explaner.length)]} ${
    namer[~~(Math.random() * namer.length)]
  }`
}

const generateRandomCard = (): MusicMetadata => {
  const random = Math.random() * 1000000

  return {
    title: generateRandomText(),
    artist: '아티스트',
    image: `https://picsum.photos/seed/${random}/200`
  }
}

const MusicCardContainer = ({ id, music }: MusicCardContainerProps) => {
  const data = useSelector((state: RootState) => state.songs)

  let selectedMetadata: MusicMetadata

  if (music) {
    selectedMetadata = music
  } else if (id) {
    // TODO : ID 값으로 노래 찾기
    selectedMetadata = generateRandomCard()

  } else {
    selectedMetadata = generateRandomCard()
  }

  return <MusicCardComponent music={selectedMetadata}></MusicCardComponent>
}

export default MusicCardContainer
