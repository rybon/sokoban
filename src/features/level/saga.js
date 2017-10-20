import {
  matchPattern,
  getParams,
  formatPattern
} from 'react-router/lib/PatternUtils'
import { all, take, put, select } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import { random } from 'utils'
import { navigateTo } from 'domains/navigation/actionCreators'
import { currentLocation } from 'domains/navigation/selectors'
import { default as NavigationConstants } from 'domains/navigation/constants'
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
import { ROUTES } from 'routes/paths'

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

function* loadLevel() {
  while (true) {
    const { payload: { pathname, action, query: { resume } } } = yield take(
      LOCATION_CHANGE
    )
    if (
      matchPattern(ROUTES.LEVEL, pathname) &&
      (!resume || (resume && action === NavigationConstants.PREVIOUS_LOCATION))
    ) {
      const { id } = getParams(ROUTES.LEVEL, pathname)
      yield put(requestLevel(id))
    }
  }
}

function* restartLevel() {
  while (true) {
    yield take(restart().type)
    const { pathname } = yield select(currentLocation)
    const { id } = getParams(ROUTES.LEVEL, pathname)
    yield put(requestLevel(id))
  }
}

function* resumeLevel() {
  while (true) {
    yield take(resume().type)
    const id = yield select(levelId)
    if (id) {
      yield put(navigateTo(formatPattern(ROUTES.LEVEL, { id }), '?resume=1'))
    } else {
      yield put(navigateTo(formatPattern(ROUTES.LEVEL, { id: 1 })))
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
    let nextLevel = currentLevel + 1
    if (nextLevel > LevelConstants.NUMBER_OF_LEVELS) {
      nextLevel = 1
    }
    yield put(navigateTo(formatPattern(ROUTES.LEVEL, { id: nextLevel })))
  }
}

function* jumpToLevel() {
  while (true) {
    const { payload: { id } } = yield take(requestJumpToLevel().type)
    yield put(navigateTo(formatPattern(ROUTES.LEVEL, { id })))
  }
}

function* randomLevel() {
  while (true) {
    yield take(requestRandomLevel().type)
    const randomLevel = randomNumberFromRange(
      random(),
      1,
      LevelConstants.NUMBER_OF_LEVELS
    )
    yield put(navigateTo(formatPattern(ROUTES.LEVEL, { id: randomLevel })))
  }
}
