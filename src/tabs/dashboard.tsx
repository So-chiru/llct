import React from 'react'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'

const DashboardTab = () => {
  return (
    <div className='llct-tab'>
      <div className='card-lists'>
        {[...new Array(32)].map((v, i) => {
          return <MusicCard key={i} id='00001'></MusicCard>
        })}
      </div>
    </div>
  )
}

export default DashboardTab
