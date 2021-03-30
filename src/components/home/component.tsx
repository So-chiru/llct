import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'

import WavesComponent from '../waves/component'

import '../../styles/components/home/home.scss'

interface TabProps {
  tab: LLCTTab
}
interface TabListProps {
  currentTab: number
  tabs: LLCTTab[]
}
interface HomeProps extends TabListProps {
  refresh: () => void
  songs: LLCTSongDataV1
}

const TabComponent = ({ tab }: TabProps) => {
  return <div className='llct-tab'>{tab.name}</div>
}

const TabListComponent = ({ currentTab, tabs }: TabListProps) => {
  const dispatch = useDispatch()

  const tabUpdateHandler = (id: number) => {
    dispatch({
      type: 'UPDATE_TAB',
      data: id
    })
  }

  return (
    <div className='llct-tab-list'>
      {tabs.map((tab, idx) => (
        <div
          className='llct-tab-button'
          key={idx}
          title={tab.name}
          data-current={currentTab === idx}
          onClick={() => tabUpdateHandler(idx)}
        >
          {tab.name}
        </div>
      ))}
    </div>
  )
}

const HomeComponent = ({ refresh, tabs, currentTab }: HomeProps) => {
  const icon = useRef<HTMLImageElement>(null)

  if (icon.current && !icon.current.classList.contains('enter')) {
    requestAnimationFrame(() => {
      if (!icon.current) {
        return
      }

      icon.current.classList.add('enter')
    })
  }

  return (
    <div className='llct-app'>
      <div onClick={() => refresh()}>목록 새로고침</div>
      <img ref={icon} className='llct-icon' src='/images/logo/Icon.svg'></img>
      <WavesComponent></WavesComponent>
      {tabs.map((tab, idx) => {
        if (idx === currentTab) {
          return <TabComponent tab={tab}></TabComponent>
        }
      })}
      <TabListComponent currentTab={currentTab} tabs={tabs}></TabListComponent>
    </div>
  )
}

export default HomeComponent
