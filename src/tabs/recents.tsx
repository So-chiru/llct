import React from 'react'
import { useSelector } from 'react-redux'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'
import { RootState } from '@/store'
import EmptyComponent from '@/components/empty/component'

const RecentPlayedTab = ({ show }: LLCTTabProps) => {
  const recents = useSelector((state: RootState) => state.recents.played)

  return (
    <div className={`llct-tab${show ? ' show' : ''}`} aria-hidden={!show}>
      {!recents.length && (
        <EmptyComponent
          text={'최근 재생 곡이 없어요...'}
          height='30vh'
        ></EmptyComponent>
      )}
      <div className='card-lists'>
        {recents &&
          recents.map((v, i) => {
            return (
              <MusicCard
                key={`card:${i}:${show}`}
                group={Number(v[0])}
                index={Number(v.slice(1, v.length))}
              ></MusicCard>
            )
          })}
      </div>
    </div>
  )
}

export default RecentPlayedTab
