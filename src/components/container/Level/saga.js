import { all, take, put, select } from 'redux-saga/effects'
import { random } from 'utils'
import {
  LOCATION_CHANGE,
  ActionCreators as NavigationActionCreators,
  Selectors as NavigationSelectors,
  Constants as NavigationConstants
} from 'domains/navigation'
import {
  ActionCreators as LevelActionCreators,
  Selectors as LevelSelectors,
  Helpers as LevelHelpers,
  Constants as LevelConstants
} from 'domains/level'
import { ActionCreators as ScoresActionCreators } from 'domains/scores'
import { ROUTES } from 'routes/paths'

export default function* levelViewSaga() {
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
    const { payload: { pathname, action, query: { id, resume } } } = yield take(
      LOCATION_CHANGE
    )
    if (
      pathname === ROUTES.LEVEL &&
      (!resume || (resume && action === NavigationConstants.PREVIOUS_LOCATION))
    ) {
      yield put(LevelActionCreators.requestLevel(id))
    }
  }
}

function* restartLevel() {
  while (true) {
    yield take(LevelActionCreators.restart().type)
    const { id } = yield select(NavigationSelectors.currentQuery)
    yield put(LevelActionCreators.requestLevel(id))
  }
}

function* resumeLevel() {
  while (true) {
    yield take(LevelActionCreators.resume().type)
    const id = yield select(LevelSelectors.levelId)
    if (id) {
      yield put(
        NavigationActionCreators.navigateTo(ROUTES.LEVEL, `?id=${id}&resume=1`)
      )
    } else {
      yield put(NavigationActionCreators.navigateTo(ROUTES.LEVEL, '?id=1'))
    }
  }
}

function* nextLevel() {
  while (true) {
    yield take(LevelActionCreators.nextLevel().type)
    const id = yield select(LevelSelectors.levelId)
    const currentLevel = parseInt(id, 10)
    const playerMoves = yield select(LevelSelectors.playerMoves)
    const boxMoves = yield select(LevelSelectors.boxMoves)
    if (currentLevel > 0 && currentLevel <= LevelConstants.NUMBER_OF_LEVELS) {
      yield put(
        ScoresActionCreators.setScore(currentLevel, playerMoves, boxMoves)
      )
    }
    let nextLevel = currentLevel + 1
    if (nextLevel > LevelConstants.NUMBER_OF_LEVELS) {
      nextLevel = 1
    }
    yield put(
      NavigationActionCreators.navigateTo(ROUTES.LEVEL, `?id=${nextLevel}`)
    )
  }
}

function* jumpToLevel() {
  while (true) {
    const { payload: { id } } = yield take(
      LevelActionCreators.jumpToLevel().type
    )
    yield put(NavigationActionCreators.navigateTo(ROUTES.LEVEL, `?id=${id}`))
  }
}

function* randomLevel() {
  while (true) {
    yield take(LevelActionCreators.randomLevel().type)
    const randomLevel = LevelHelpers.randomNumberFromRange(
      random(),
      1,
      LevelConstants.NUMBER_OF_LEVELS
    )
    yield put(
      NavigationActionCreators.navigateTo(ROUTES.LEVEL, `?id=${randomLevel}`)
    )
  }
}
