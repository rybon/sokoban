import { all, take, call, put, select } from 'redux-saga/effects'
import { getRequest, postRequest } from 'domains/base/services'
import ActionTypes from './actionTypes'
import { setAllScores } from './actionCreators'
import { levelsScores } from './selectors'

const URL = '/api/scores'

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

export default function* scoresSaga() {
  yield all([initialize(), saveScores()])
}
