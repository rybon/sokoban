import { all } from 'redux-saga/effects'
import timeSaga from 'domains/time/saga'
import levelFeatureSaga from 'features/level/saga'
import levelSaga from 'domains/level/saga'
import scoresSaga from 'domains/scores/saga'

export default function* appSaga() {
  yield all([timeSaga(), levelFeatureSaga(), levelSaga(), scoresSaga()])
}
