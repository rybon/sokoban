import { CANCEL } from 'redux-saga'
import {
  takeLatest,
  fork,
  join,
  put,
  cancelled,
  cancel
} from 'redux-saga/effects'
import { getRequest } from 'domains/base/services'
import ActionTypes from './actionTypes'
import { receivedLevel } from './actionCreators'
import { formatLevel } from './formatters'

function* requestLevel({ payload: { id = '0' } }) {
  let task
  try {
    task = yield fork(
      getRequest,
      { url: `/api/levels/${id}`, cancellationToken: CANCEL },
      result => formatLevel(id, result)
    )
    const result = yield join(task)
    yield put(receivedLevel(result))
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  } finally {
    if (yield cancelled()) {
      yield cancel(task)
    }
  }
}

export default function* levelSaga() {
  yield takeLatest(ActionTypes.REQUEST_LEVEL, requestLevel)
}
