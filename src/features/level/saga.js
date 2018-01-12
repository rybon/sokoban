import { matchPath } from 'react-router'
import qs from 'qs'
import { all, take, put, select } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'connected-react-router/immutable'
import { random } from 'utils'
import { navigateTo } from 'domains/navigation/actionCreators'
import { currentLocation } from 'domains/navigation/selectors'
import {
  requestLevel,
  resume,
  restart,
  nextLevel as requestNextLevel,
  jumpToLevel as requestJumpToLevel,
  randomLevel as requestRandomLevel
} from 'domains/level/actionCreators'
import { levelId, playerMoves, boxMoves } from 'domains/level/selectors'
import { randomNumberFromRange } from 'domains/level/helpers'
import * as LevelConstants from 'domains/level/constants'
import { setScore } from 'domains/scores/actionCreators'
import ROUTES from 'routes/index'

const generatePath = (path, params) => {
  let generatedPath = path
  Object.keys(params).forEach(key => {
    generatedPath = generatedPath.replace(`:${key}`, params[key])
  })
  return generatedPath
}

function* loadLevel() {
  while (true) {
    const { payload: { location: { pathname, search }, action } } = yield take(
      LOCATION_CHANGE
    )
    const query = qs.parse(search.substring(1))
    if (
      matchPath(pathname, ROUTES.LEVEL) &&
      (!query.resume || (query.resume && action === 'POP'))
    ) {
      const { params: { id } } = matchPath(pathname, ROUTES.LEVEL)
      yield put(requestLevel(id))
    }
  }
}

function* restartLevel() {
  while (true) {
    yield take(restart().type)
    const { pathname } = yield select(currentLocation)
    const { params: { id } } = matchPath(pathname, ROUTES.LEVEL)
    yield put(requestLevel(id))
  }
}

function* resumeLevel() {
  while (true) {
    yield take(resume().type)
    const id = yield select(levelId)
    if (id) {
      yield put(navigateTo(generatePath(ROUTES.LEVEL, { id }), '?resume=1'))
    } else {
      yield put(navigateTo(generatePath(ROUTES.LEVEL, { id: 1 })))
    }
  }
}

function* nextLevel() {
  while (true) {
    yield take(requestNextLevel().type)
    const id = yield select(levelId)
    const currentLevel = parseInt(id, 10)
    const currentPlayerMoves = yield select(playerMoves)
    const currentBoxMoves = yield select(boxMoves)
    if (currentLevel > 0 && currentLevel <= LevelConstants.NUMBER_OF_LEVELS) {
      yield put(setScore(currentLevel, currentPlayerMoves, currentBoxMoves))
    }
    let nextLevelAfterCurrent = currentLevel + 1
    if (nextLevelAfterCurrent > LevelConstants.NUMBER_OF_LEVELS) {
      nextLevelAfterCurrent = 1
    }
    yield put(
      navigateTo(generatePath(ROUTES.LEVEL, { id: nextLevelAfterCurrent }))
    )
  }
}

function* jumpToLevel() {
  while (true) {
    const { payload: { id } } = yield take(requestJumpToLevel().type)
    yield put(navigateTo(generatePath(ROUTES.LEVEL, { id })))
  }
}

function* randomLevel() {
  while (true) {
    yield take(requestRandomLevel().type)
    const generatedRandomLevel = randomNumberFromRange(
      random(),
      1,
      LevelConstants.NUMBER_OF_LEVELS
    )
    yield put(
      navigateTo(generatePath(ROUTES.LEVEL, { id: generatedRandomLevel }))
    )
  }
}

export default function* levelFeatureSaga() {
  yield all([
    loadLevel(),
    restartLevel(),
    resumeLevel(),
    nextLevel(),
    jumpToLevel(),
    randomLevel()
  ])
}
