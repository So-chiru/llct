import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import UIReducer from './ui/reducer'
import SongsReducer from './songs/reducer'
import CallReducer from './call/reducer'
import PlayingReducer from './player/reducer'
import SettingsReducer from './settings/reducer'

import { fetchAPIDataSaga } from './sagas'

const sagaMiddleware = createSagaMiddleware()

// 최상위 Reducer. 하위 Reducer들을 여기다 집어 넣습니다.
const reducers = combineReducers({
  call: CallReducer,
  songs: SongsReducer,
  playing: PlayingReducer,
  ui: UIReducer,
  settings: SettingsReducer
})

// 하위 컴포넌트에서 최상위 Reducer에서 추론된 타입을 이용할 수 있도록 RootState 변수를 지정합니다.
export type RootState = ReturnType<typeof reducers>

// react-redux 저장소를 만듭니다.
const store = createStore(reducers, applyMiddleware(sagaMiddleware))
export default store

// 하위 saga들을 모두 실행합니다.
function * rootSaga () {
  yield all([fetchAPIDataSaga()])
}

sagaMiddleware.run(rootSaga)
