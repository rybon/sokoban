import { delay } from 'redux-saga'
import { put } from 'redux-saga/effects'
import { now } from 'utils'
import { tick } from './actionCreators'

export default function* timeSaga() {
  while (true) {
    const timestamp = now()
    yield put(tick(timestamp))
    const rest = timestamp % 60000
    yield delay(60000 - rest)
  }
}
