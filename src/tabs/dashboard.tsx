import React from 'react'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'

const DashboardTab = () => {
  return (
    <div className='llct-tab'>
      <div className='card-lists'>
        <MusicCard id='00001'></MusicCard>
        <MusicCard id='00001'></MusicCard>
        <MusicCard id='00001'></MusicCard>
        <MusicCard id='00001'></MusicCard>
      </div>
    </div>
  )
}

export default DashboardTab
