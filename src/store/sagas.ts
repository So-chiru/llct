import { call, put, takeEvery } from 'redux-saga/effects'

import * as apis from '../api'

function * fetchAPIData () {
  try {
    const data = yield call(apis.fetchAPI)

    yield put({ type: '@llct/api_lists/success', data: data })
  } catch (e) {
    yield put({ type: '@llct/api_lists/failed', message: e.message })
  }
}

export function * fetchAPIDataSaga () {
  yield takeEvery('@llct/api_lists/request', fetchAPIData)
}
