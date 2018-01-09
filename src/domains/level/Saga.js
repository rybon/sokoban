import { CANCEL } from 'redux-saga'
import {
  takeLatest,
  fork,
  join,
  put,
  cancelled,
  cancel
} from 'redux-saga/effects'
import { GRAPHQL_ENDPOINT } from 'domains/base/constants'
import { getRequest } from 'domains/base/services'
import ActionTypes from './actionTypes'
import { receivedLevel } from './actionCreators'
import { formatLevel } from './formatters'

const levelQuery = 'query($id:ID!){level(id:$id){id rows}}'

function* requestLevel({ payload: { id = '0' } }) {
  let task
  try {
    const variables = JSON.stringify({ id })
    const url = global.encodeURI(
      `${GRAPHQL_ENDPOINT}?query=${levelQuery}&variables=${variables}`
    )
    task = yield fork(
      getRequest,
      { url, cancellationToken: CANCEL },
      formatLevel
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
