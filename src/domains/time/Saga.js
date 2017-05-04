import { delay } from 'redux-saga';
import {
    put
} from 'redux-saga/effects';
import { tick } from './ActionCreators';

export default function* timeDomainSaga() {
    while (true) {
        const now = Date.now();
        yield put(tick(now));
        const rest = now % 60000;
        yield delay(60000 - rest);
    }
}
