import React from 'react'

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '../styles/themes'
import { GlobalStyles } from '../styles/global'
import { Provider } from 'react-redux'
import store from '../store/index'

import Home from './home'

const App: React.FC = (...args) => {
  console.log(args)

  // TODO : ThemeProvider 테마 처리

  return (
    <Provider store={store}>
      <ThemeProvider theme={light}>
        <GlobalStyles></GlobalStyles>
        <Router>
          <Home></Home>
          <Switch>
            <Route path='/player'></Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
