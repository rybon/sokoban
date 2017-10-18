import { all } from 'redux-saga/effects'
import { default as timeSaga } from 'domains/time/saga'
import levelFeatureSaga from 'features/level/saga'
import { default as levelSaga } from 'domains/level/saga'
import { default as scoresSaga } from 'domains/scores/saga'

export default function* appSaga() {
  yield all([timeSaga(), levelFeatureSaga(), levelSaga(), scoresSaga()])
}
