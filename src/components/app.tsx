import React from 'react'

import { Route, Switch } from 'react-router-dom'

import WavesContainer from './waves/container'
import HomeContainer from './home/container'

const App = () => {
  return (
    <>
      <WavesContainer></WavesContainer>
      <HomeContainer></HomeContainer>
      <Switch>
        <Route path='/settings'></Route>
        <Route path='/player'></Route>
      </Switch>
    </>
  )
}

export default App
