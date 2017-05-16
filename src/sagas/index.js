import { all } from 'redux-saga/effects'
import { saga as timeDomainSaga } from 'domains/time'
import levelViewSaga from 'components/container/Level/saga'
import { saga as levelDomainSaga } from 'domains/level'
import { saga as scoresDomainSaga } from 'domains/scores'

export default function* appSaga() {
  yield all([
    timeDomainSaga(),
    levelViewSaga(),
    levelDomainSaga(),
    scoresDomainSaga()
  ])
}
