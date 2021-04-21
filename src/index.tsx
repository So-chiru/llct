import React from 'react'
import { render } from 'react-dom'

import App from './components/app'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store/index'

import './styles/index.scss'

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
