import {
    takeLatest,
    fork,
    join,
    put,
    cancelled,
    cancel
} from 'redux-saga/effects';
import ActionTypes from './ActionTypes';
import { fetchLevel } from './Services';
import { receivedLevel } from './ActionCreators';

export default function* levelDomainSaga() {
    yield takeLatest(ActionTypes.REQUEST_LEVEL, requestLevel);
}

function* requestLevel({ payload: { id } }) {
    let task;
    try {
        task = yield fork(fetchLevel, id);
        const result = yield join(task);
        yield put(receivedLevel(result));
    } catch (error) {
        console.error(error); // eslint-disable-line no-console
    } finally {
        if (yield cancelled()) {
            yield cancel(task);
        }
    }
}
