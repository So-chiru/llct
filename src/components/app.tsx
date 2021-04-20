import React, { useEffect, useState } from 'react'

import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '@/styles/themes'
import { GlobalStyles } from '@/styles/global'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/index'

import WavesContainer from './waves/page/container'
import HomeContainer from './home/container'
import PlayerButtonContainer from './player-button/container'
import PlayerContainer from './player/container'
import DataLoderContainer from './data-loader/container'
import PlayerInstanceContainer from './player/instance/container'

import {
  checkSystemDark,
  toggleDarkMode,
  useDarkMode,
  onModeUpdate
} from '@/utils/darkmode'

const App = () => {
  const [_, refresh] = useState<number>(0)

  const useDark = useSelector(
    (state: RootState) => state.settings.useDarkMode.value
  )

  const useSystemMatchDarkMode = useSelector(
    (state: RootState) => state.settings.matchSystemAppearance.value
  )

  const darkMode = checkSystemDark(useDark, useSystemMatchDarkMode)

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

  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <GlobalStyles></GlobalStyles>
      <WavesContainer></WavesContainer>
      <DataLoderContainer></DataLoderContainer>
      <HomeContainer></HomeContainer>
      <PlayerButtonContainer></PlayerButtonContainer>
      <PlayerContainer></PlayerContainer>
      <PlayerInstanceContainer></PlayerInstanceContainer>
      <Switch>
        <Route path='/settings'></Route>
        <Route path='/play/:id' exact></Route>
      </Switch>
    </ThemeProvider>
  )
}

export default App
