import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/index'

import PageWaves from './waves/page/container'
import HomeContainer from './home/container'
import PlayerButton from './player-button/container'
import PlayerContainer from './player/container'
import DataLoderContainer from './data-loader/container'
import PlayerInstanceContainer from './player/instance/container'

import {
  checkSystemDark,
  toggleDarkMode,
  useDarkMode,
  onModeUpdate
} from '@/utils/darkmode'

const useColorScheme = () => {
  const [, refresh] = useState<number>(0)

  const useDark = useSelector(
    (state: RootState) => state.settings.useDarkMode.value
  )

  const useSystemMatchDarkMode = useSelector(
    (state: RootState) => state.settings.matchSystemAppearance.value
  )

  const darkMode = checkSystemDark(
    useDark as boolean,
    useSystemMatchDarkMode as boolean
  )

  const colorUpdate = () => {
    requestAnimationFrame(() => {
      if (
        (useSystemMatchDarkMode && useDarkMode()) ||
        (!useSystemMatchDarkMode && useDark)
      ) {
        toggleDarkMode(true)
        return
      }

      toggleDarkMode(false)
    })
  }

  useEffect(colorUpdate, [useDark, useSystemMatchDarkMode])

  useEffect(() => {
    onModeUpdate(() => {
      colorUpdate()
      refresh(Math.random())
    })
  }, [])

  useEffect(() => {}, [darkMode])

  return darkMode
}

const useServiceWorker = () => {
  const useServiceWorker = useSelector(
    (state: RootState) => state.settings.useServiceWorker.value
  )

  const [registration, setRegistration] = useState<ServiceWorkerRegistration>()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (!registration && useServiceWorker) {
        const register = async () => {
          const registration = await navigator.serviceWorker.register(
            '/service-worker.js',
            {
              scope: '/'
            }
          )

          registration.addEventListener('updatefound', () => {
            // TODO : 업데이트가 있을 경우 알림 표시
          })

          setRegistration(registration)
        }

        if (document.readyState === 'loading') {
          window.addEventListener('load', register)
        } else {
          register()
        }

        return
      }

      if (registration && !useServiceWorker) {
        (async () => {
          await registration.unregister()

          setRegistration(undefined)
        })()
      }
    }
  }, [registration, useServiceWorker])
}

const App = () => {
  const darkMode = useColorScheme()
  useServiceWorker()

  return (
    <>
      <PageWaves></PageWaves>
      <PlayerButton></PlayerButton>
      <DataLoderContainer></DataLoderContainer>
      <HomeContainer></HomeContainer>
      <PlayerContainer></PlayerContainer>
      <PlayerInstanceContainer></PlayerInstanceContainer>
    </>
  )
}

export default App
