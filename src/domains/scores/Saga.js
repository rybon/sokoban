import { all, take, call, put, select } from 'redux-saga/effects'
import { getRequest, postRequest } from 'domains/base/Services'
import ActionTypes from './ActionTypes'
import { setAllScores } from './ActionCreators'
import { levelsScores } from './Selectors'

const URL = '/api/scores'

export default function* scoresDomainSaga() {
  yield all([initialize(), saveScores()])
}

function* initialize() {
  const fetchedScores = yield call(getRequest, { url: URL })
  yield put(setAllScores(fetchedScores))
}

function* saveScores() {
  while (true) {
    yield take([
      ActionTypes.SET_SCORE,
      ActionTypes.REMOVE_SCORE,
      ActionTypes.REMOVE_ALL_SCORES
    ])
    const scores = yield select(levelsScores)
    yield call(postRequest, { url: URL, content: scores.toJS() })
  }
}
