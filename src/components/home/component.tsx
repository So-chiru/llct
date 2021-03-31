import DashboardTab from '@/tabs/dashboard'
import SettingsTab from '@/tabs/settings'

import { CSSTransition } from 'react-transition-group'

import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import '@/styles/components/home/home.scss'
import '@/styles/animate.scss'

const Pages: Record<string, JSX.Element> = {
  dashboard: <DashboardTab></DashboardTab>,
  settings: <SettingsTab></SettingsTab>
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

  return <div className='llct-tab'>{tab.name} 페이지의 내용은 없습니다.</div>
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
            key={idx}
            title={tab.name}
            data-current={currentTab === idx}
            onClick={() => tabUpdateHandler(idx)}
          >
            {tab.name}
          </div>
        ))}
      </div>
    </CSSTransition>
  )
}

const addClassOnLoad = (element: HTMLElement, style: string) => {
  if (!element.classList.contains(style)) {
    requestAnimationFrame(() => {
      if (!element) {
        return
      }

      element.classList.add(style)
    })
  }
}

const HomeComponent = ({ tabs, currentTab }: TabListProps) => {
  const icon = useRef<HTMLImageElement>(null)

  if (icon.current) {
    addClassOnLoad(icon.current, 'enter')
  }

  const [firstAnimate, setFirstAnimate] = useState(true)

  // TODO : TabListComponent 마우스로 드래그 했을 때 스크롤될 수 있게 TouchHandler 클래스 구현

  return (
    <div className='llct-app'>
      <img ref={icon} className='llct-icon' src='/images/logo/Icon.svg'></img>
      {tabs.map((tab, idx) => {
        if (idx === currentTab) {
          return (
            <CSSTransition
              in
              appear={true}
              key={idx}
              addEndListener={(node, done) => {
                node.addEventListener(
                  'transitionend',
                  () => {
                    setFirstAnimate(false)
                    done()
                  },
                  false
                )
              }}
              classNames={`llct-tab-animate${firstAnimate ? '' : '-nodelay'}`}
            >
              <TabComponent tab={tab}></TabComponent>
            </CSSTransition>
          )
        }
      })}

      <TabListComponent currentTab={currentTab} tabs={tabs}></TabListComponent>
    </div>
  )
}

export default HomeComponent
