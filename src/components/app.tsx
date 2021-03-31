import React from 'react'

import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '@/styles/themes'
import { GlobalStyles } from '@/styles/global'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/index'

import WavesContainer from './waves/container'
import HomeContainer from './home/container'

const App = () => {
  const useDark = useSelector((state: RootState) => state.ui.useDarkMode)

  return (
    <ThemeProvider theme={useDark ? dark : light}>
      <GlobalStyles></GlobalStyles>
      <WavesContainer></WavesContainer>
      <HomeContainer></HomeContainer>
      <Switch>
        <Route path='/settings'></Route>
        <Route path='/player'></Route>
      </Switch>
    </ThemeProvider>
  )
}

export default App
