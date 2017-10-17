import { CANCEL } from 'redux-saga'
import {
  takeLatest,
  fork,
  join,
  put,
  cancelled,
  cancel
} from 'redux-saga/effects'
import { getRequest } from 'domains/base/Services'
import ActionTypes from './ActionTypes'
import { receivedLevel } from './ActionCreators'
import { formatLevel } from './Formatters'

export default function* levelDomainSaga() {
  yield takeLatest(ActionTypes.REQUEST_LEVEL, requestLevel)
}

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
