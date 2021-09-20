import React from 'react'
import { useSelector } from 'react-redux'

import '@/styles/tabs/dashboard.scss'

import MusicCard from '@/components/music-card/container'
import { RootState } from '@/store'
import EmptyComponent from '@/components/empty/component'
import MusicCardContainer from '@/components/music-card/container'
import DashboardLive from '@/components/dashboard/live'
import DashboardBirthday from '@/components/dashboard/birthday'
import DashboardLink from '@/components/dashboard/link'

const DashboardMusicSet = ({ data }: { data: DashboardMusicComponent[] }) => {
  return (
    <div className='dashboard-component card-lists'>
      {data.map(v => (
        <MusicCardContainer
          key={`dashboard-random-${v.id}`}
          id={v.id}
        ></MusicCardContainer>
      ))}
    </div>
  )
}

const DashboardComponent = ({ data }: { data: LLCTDashboard }) => {
  let component = <></>

  if (data.type === 'live') {
    component = <DashboardLive data={data.live}></DashboardLive>
  } else if (data.type === 'musicset') {
    component = <DashboardMusicSet data={data.musicset}></DashboardMusicSet>
  } else if (data.type === 'birthday') {
    component = <DashboardBirthday data={data.birthday}></DashboardBirthday>
  } else if (data.type === 'linkset') {
    component = <DashboardLink data={data.linkset}></DashboardLink>
  }

  return (
    <div className='dashboard-section'>
      <h3 className='dashboard-section-title'>{data.title}</h3>
      <div className='dashboard-contents'>{component}</div>
    </div>
  )
}

const DashboardTab = ({ show }: LLCTTabProps) => {
  const data = useSelector((state: RootState) => state.songs)
  const updates = useSelector((state: RootState) => state.updates)

  return (
    <div className={`llct-tab${show ? ' show' : ''}`} aria-hidden={!show}>
      {data && data.error && (
        <EmptyComponent text={`${data.error}`} height='30vh'></EmptyComponent>
      )}
      <div className='dashboard-tab'>
        {updates && updates.data && updates.data.dashboards && (
          <>
            {updates.data.dashboards.map((v, i) => (
              <DashboardComponent
                key={`dashboard-${i}`}
                data={v}
              ></DashboardComponent>
            ))}
            <p className='data-copyright'>
              * 생일, 라이브 데이터는{' '}
              <a
                href='https://cal.llasfans.net'
                target='_blank'
                rel='noreferrer'
              >
                LLCalendar
              </a>
              에서 정보를 가져옵니다.
            </p>
          </>
        )}
        {(!data || !data.items) &&
          [...new Array(4)].map((v, i) => {
            return <MusicCard key={`template:${i}`} skeleton={true}></MusicCard>
          })}
      </div>
    </div>
  )
}

export default DashboardTab
