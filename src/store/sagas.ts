import { call, put, takeEvery } from 'redux-saga/effects'

import * as apis from '../api'

function * fetchAPIData () {
  try {
    const data = yield call(apis.fetchAPI)

    yield put({ type: 'LLCT_DATA_FETCH_SUCCEED', data: data })
  } catch (e) {
    yield put({ type: 'LLCT_DATA_FETCH_FAILED', message: e.message })
  }
}

export function * fetchAPIDataSaga () {
  yield takeEvery('LLCT_DATA_FETCH_REQUEST', fetchAPIData)
}
