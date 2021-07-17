import DashboardTab from '@/tabs/dashboard'
import SettingsTab from '@/tabs/settings'
import SongsTab from '@/tabs/songs'

import EmptyComponent from '@/components/empty/component'

import { CSSTransition } from 'react-transition-group'

import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import '@/styles/components/home/home.scss'
import '@/styles/animate.scss'
import RecentPlayedTab from '@/tabs/recents'

interface TabProps {
  tab: LLCTTab
  show: boolean
}
interface TabListProps {
  currentTab: number
  tabs: LLCTTab[]
}

const TabComponent = ({ tab, show }: TabProps) => {
  switch (tab.page) {
    case 'dashboard':
      return <DashboardTab show={show}></DashboardTab>
    case 'settings':
      return <SettingsTab show={show}></SettingsTab>
    case 'recent':
      return <RecentPlayedTab show={show}></RecentPlayedTab>
    case 'songs':
      return <SongsTab show={show}></SongsTab>
    default:
      return (
        <div className={`llct-tab${show ? ' show' : ''}`} aria-hidden={!show}>
          <EmptyComponent
            text={tab.name + ' 페이지는 텅 비었어요...'}
            height='30vh'
          ></EmptyComponent>
        </div>
      )
  }
}

const TabListComponent = ({ currentTab, tabs }: TabListProps) => {
  const dispatch = useDispatch()

  const tabUpdateHandler = (id: number) => {
    dispatch({
      type: '@llct/tab/update',
      data: id
    })
  }

  return (
    <CSSTransition
      in
      appear={true}
      addEndListener={(node, done) => {
        node.addEventListener(
          'transitionend',
          () => {
            done()
          },
          false
        )
      }}
      classNames='llct-animate'
    >
      <div className='llct-tab-list'>
        {tabs.map((tab, idx) => (
          <div
            className='llct-tab-button'
            role='button'
            tabIndex={10 + idx}
            key={idx}
            title={tab.name}
            aria-label={tab.name + ' 탭으로 가기'}
            data-current={currentTab === idx}
            onClick={() => tabUpdateHandler(idx)}
            onKeyPress={ev =>
              (ev.code === 'Enter' || ev.code === 'Space') &&
              tabUpdateHandler(idx)
            }
          >
            <span className='text'>{tab.name}</span>
          </div>
        ))}
      </div>
    </CSSTransition>
  )
}

const HomeComponent = ({ tabs, currentTab }: TabListProps) => {
  return (
    <div className='llct-app'>
      <img
        aria-label={'LLCT 로고'}
        className='llct-icon'
        src='/images/logo/Icon.svg'
      ></img>
      {tabs.map((tab, idx) => {
        return useMemo(
          () => (
            <TabComponent
              key={idx}
              tab={tab}
              show={idx === currentTab}
            ></TabComponent>
          ),
          [idx === currentTab]
        )
      })}

      <TabListComponent currentTab={currentTab} tabs={tabs}></TabListComponent>
    </div>
  )
}

export default HomeComponent
