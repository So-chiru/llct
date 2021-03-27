import React from 'react'
import { render } from 'react-dom'

import App from './components/app'

import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'

import store from './store/index'

import { GlobalStyles } from './styles/global'
import { light, dark } from './styles/themes'
import './styles/index.scss'

render(
  <Provider store={store}>
    <ThemeProvider theme={light}>
      <GlobalStyles></GlobalStyles>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)
