import React from 'react'
import { useSelector } from 'react-redux'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'
import { RootState } from '@/store'

const DashboardTab = () => {
  const data = useSelector((state: RootState) => state.songs)

  // TODO : API_SERVER/updates 에서 추천 목록 가져오기
  return (
    <div className='llct-tab'>
      <div className='card-lists'>
        {!data
          ? [...new Array(12)].map((v, i) => {
              return (
                <MusicCard key={`template:${i}`} skeleton={true}></MusicCard>
              )
            })
          : [...new Array(12)].map((v, i) => {
              return <MusicCard key={`card:${i}`} id='10001'></MusicCard>
            })}
      </div>
    </div>
  )
}

export default DashboardTab
