import React from 'react'

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

const App = () => {
  const useDark = useSelector((state: RootState) => state.ui.useDarkMode)

  return (
    <ThemeProvider theme={useDark ? dark : light}>
      <GlobalStyles></GlobalStyles>
      <WavesContainer></WavesContainer>
      <DataLoderContainer></DataLoderContainer>
      <HomeContainer></HomeContainer>
      <PlayerButtonContainer></PlayerButtonContainer>
      <PlayerContainer></PlayerContainer>
      <Switch>
        <Route path='/settings'></Route>
        <Route path='/play/:id' exact></Route>
      </Switch>
    </ThemeProvider>
  )
}

export default App
