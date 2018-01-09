import { all, take, call, put, select } from 'redux-saga/effects'
import { GRAPHQL_ENDPOINT } from 'domains/base/constants'
import { getRequest, postRequest } from 'domains/base/services'
import ActionTypes from './actionTypes'
import { setScore, setAllScores } from './actionCreators'
import {
  levelsScores,
  bestPlayerMovesForLevel,
  bestBoxMovesForLevel
} from './selectors'
import { formatIncomingScores, formatOutgoingScores } from './formatters'

const scoresQuery = '{scores{id playerMoves boxMoves}}'
const scoresMutation =
  'mutation($scoresToSet:ScoresInput!){setScores(input:$scoresToSet){id playerMoves boxMoves}}'
const scoreMutation =
  'mutation($scoreToSet:ScoreInput!){setScore(input:$scoreToSet){id playerMoves boxMoves}}'

function* initialize() {
  const url = global.encodeURI(`${GRAPHQL_ENDPOINT}?query=${scoresQuery}`)
  const fetchedScores = yield call(getRequest, { url }, formatIncomingScores)
  yield put(setAllScores(fetchedScores))
}

function* saveScores() {
  while (true) {
    const { type, payload } = yield take([
      ActionTypes.SET_SCORE,
      ActionTypes.REMOVE_SCORE,
      ActionTypes.REMOVE_ALL_SCORES
    ])
    const isScoreUpdate =
      type === ActionTypes.SET_SCORE || type === ActionTypes.REMOVE_SCORE
    const url = GRAPHQL_ENDPOINT
    let query = scoresMutation
    const variables = {}
    if (isScoreUpdate) {
      query = scoreMutation
      const playerMoves = yield select(bestPlayerMovesForLevel, payload.id)
      const boxMoves = yield select(bestBoxMovesForLevel, payload.id)
      variables.scoreToSet = {
        id: payload.id,
        playerMoves,
        boxMoves
      }
    } else {
      const scores = yield select(levelsScores)
      variables.scoresToSet = {
        scores: formatOutgoingScores(scores.toJS())
      }
    }
    const content = {
      query,
      variables
    }
    if (isScoreUpdate) {
      const { data } = yield call(postRequest, { url, content })
      yield put(
        setScore(
          data.setScore.id,
          data.setScore.playerMoves,
          data.setScore.boxMoves
        )
      )
    } else {
      const fetchedScores = yield call(
        postRequest,
        { url, content },
        formatIncomingScores
      )
      yield put(setAllScores(fetchedScores))
    }
  }
}

export default function* scoresSaga() {
  yield all([initialize(), saveScores()])
}
