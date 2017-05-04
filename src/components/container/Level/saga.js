import {
    take,
    put,
    select
} from 'redux-saga/effects';
import {
    LOCATION_CHANGE,
    ActionCreators as NavigationActionCreators,
    Selectors as NavigationSelectors,
    Constants as NavigationConstants
} from 'domains/navigation';
import {
    ActionCreators as LevelActionCreators,
    Selectors as LevelSelectors,
    Helpers as LevelHelpers,
    Constants as LevelConstants
} from 'domains/level';
import {
    ActionCreators as ScoresActionCreators
} from 'domains/scores';
import { ROUTES } from 'routes/paths';

export default function* levelViewSaga() {
    yield [
        loadLevel(),
        restartLevel(),
        resumeLevel(),
        nextLevel(),
        jumpToLevel(),
        randomLevel()
    ];
}

function* loadLevel() {
    while (true) {
        const { payload: { pathname, action, query: { id, resume } } } = yield take(LOCATION_CHANGE);
        if (pathname === ROUTES.LEVELS && (!resume || (resume && action === NavigationConstants.PREVIOUS_LOCATION))) {
            yield put(LevelActionCreators.requestLevel(id));
        }
    }
}

function* restartLevel() {
    while (true) {
        yield take(LevelActionCreators.restart().type);
        const { id } = yield select(NavigationSelectors.currentQuery);
        yield put(LevelActionCreators.requestLevel(id));
    }
}

function* resumeLevel() {
    while (true) {
        yield take(LevelActionCreators.resume().type);
        const id = yield select(LevelSelectors.levelId);
        if (id) {
            yield put(NavigationActionCreators.navigateTo(ROUTES.LEVELS, `?id=${id}&resume=1`));
        } else {
            yield put(NavigationActionCreators.navigateTo(ROUTES.LEVELS, '?id=1'));
        }
    }
}

function* nextLevel() {
    while (true) {
        yield take(LevelActionCreators.nextLevel().type);
        const id = yield select(LevelSelectors.levelId);
        const currentLevel = parseInt(id);
        const playerMoves = yield select(LevelSelectors.playerMoves);
        const boxMoves = yield select(LevelSelectors.boxMoves);
        yield put(ScoresActionCreators.setScore(currentLevel, playerMoves, boxMoves));
        let nextLevel = currentLevel + 1;
        if (nextLevel > LevelConstants.NUMBER_OF_LEVELS) {
            nextLevel = 1;
        }
        yield put(NavigationActionCreators.navigateTo(ROUTES.LEVELS, `?id=${nextLevel}`));
    }
}

function* jumpToLevel() {
    while (true) {
        const { payload: { id } } = yield take(LevelActionCreators.jumpToLevel().type);
        yield put(NavigationActionCreators.navigateTo(ROUTES.LEVELS, `?id=${id}`));
    }
}

function* randomLevel() {
    while (true) {
        yield take(LevelActionCreators.randomLevel().type);
        const randomLevel = LevelHelpers.randomNumberFromRange(Math.random(), 1, LevelConstants.NUMBER_OF_LEVELS);
        yield put(NavigationActionCreators.navigateTo(ROUTES.LEVELS, `?id=${randomLevel}`));
    }
}
