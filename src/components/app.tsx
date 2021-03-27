import React from 'react'

import { Route, Switch } from 'react-router-dom'

import HomeContainer from './home/container'

const App: React.FC = (...args) => {
  return (
    <>
      <HomeContainer></HomeContainer>
      <Switch>
        <Route path='/settings'></Route>
        <Route path='/player'></Route>
      </Switch>
    </>
  )
}

export default App
