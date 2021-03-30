import DashboardTab from '@/tabs/dashboard'

import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'

import '@/styles/components/home/home.scss'

const Pages: Record<string, JSX.Element> = {
  dashboard: <DashboardTab></DashboardTab>
}

interface TabProps {
  tab: LLCTTab
}
interface TabListProps {
  currentTab: number
  tabs: LLCTTab[]
}

const TabComponent = ({ tab }: TabProps) => {
  if (tab.page && Pages[tab.page]) {
    return Pages[tab.page]
  }

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

const HomeComponent = ({ tabs, currentTab }: TabListProps) => {
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
      <img ref={icon} className='llct-icon' src='/images/logo/Icon.svg'></img>
      {tabs.map((tab, idx) => {
        if (idx === currentTab) {
          return <TabComponent key={idx} tab={tab}></TabComponent>
        }
      })}
      <TabListComponent currentTab={currentTab} tabs={tabs}></TabListComponent>
    </div>
  )
}

export default HomeComponent
