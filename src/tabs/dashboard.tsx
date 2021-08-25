import React from 'react'
import { useSelector } from 'react-redux'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'
import { RootState } from '@/store'
import EmptyComponent from '@/components/empty/component'
import { randomSongs } from '@/utils/songs'

const DashboardTab = ({ show }: LLCTTabProps) => {
  const data = useSelector((state: RootState) => state.songs)

  // TODO : API_SERVER/updates 에서 추천 목록 가져오기
  return (
    <div className={`llct-tab${show ? ' show' : ''}`} aria-hidden={!show}>
      {data && data.error && (
        <EmptyComponent text={`${data.error}`} height='30vh'></EmptyComponent>
      )}
      <div className='dashboard-tab'>
        <div className='dashboard-section'>
          <h3 className='dashboard-section-title'>랜덤 곡을 뽑아볼까요?</h3>
          <div className='card-lists'>
            {!data || !data.items
              ? [...new Array(4)].map((v, i) => {
                  return (
                    <MusicCard
                      key={`template:${i}`}
                      skeleton={true}
                    ></MusicCard>
                  )
                })
              : randomSongs(data.items, 4).map((v, i) => {
                  return <MusicCard key={`template:${i}`} id={v}></MusicCard>
                })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTab
