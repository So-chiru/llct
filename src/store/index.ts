import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import LLCTReducer from './llct'

const reducers = combineReducers({
  llct: LLCTReducer
})

const store = createStore(reducers, applyMiddleware(thunk))

export default store
