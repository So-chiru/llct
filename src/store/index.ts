import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import LLCTReducer from './llct'
import ThemeReducer from './theme'

// TODO : LLCTReducer가 뭐하는 건지 이름에서 짐작이 안됨

const reducers = combineReducers({
  llct: LLCTReducer,
  theme: ThemeReducer
})

const store = createStore(reducers, applyMiddleware(thunk))

export default store
