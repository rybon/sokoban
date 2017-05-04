import {
    take,
    call,
    put,
    select
} from 'redux-saga/effects';
import ActionTypes from './ActionTypes';
import { fetchScores, persistScores } from './Services';
import { setAllScores } from './ActionCreators';
import { levelsScores } from './Selectors';

export default function* scoresDomainSaga() {
    yield [
        initialize(),
        saveScores()
    ];
}

function* initialize() {
    const fetchedScores = yield call(fetchScores);
    yield put(setAllScores(fetchedScores));
}

function* saveScores() {
    while (true) {
        yield take([
            ActionTypes.SET_SCORE,
            ActionTypes.REMOVE_SCORE,
            ActionTypes.REMOVE_ALL_SCORES
        ]);
        const scores = yield select(levelsScores);
        yield call(persistScores, scores.toJS());
    }
}
