import { AnyAction } from 'redux'
import { call, put, takeEvery } from 'redux-saga/effects'

import * as apis from '../api'

function * fetchAPIData () {
  try {
    const data = yield call(apis.fetchAPI)

    yield put({ type: '@llct/api_lists/success', data: data })
  } catch (e) {
    yield put({ type: '@llct/api_lists/failed', error: e.message })
  }
}

function * fetchCallData ({ id }: AnyAction) {
  try {
    const data = yield call(apis.fetchCallData, id)

    yield put({ type: '@llct/api_call/success', data: data })
  } catch (e) {
    yield put({ type: '@llct/api_call/failed', error: e.message })
  }
}

export function * fetchAPIDataSaga () {
  yield takeEvery('@llct/api_lists/request', fetchAPIData)
  yield takeEvery('@llct/api_call/request', fetchCallData)
}
