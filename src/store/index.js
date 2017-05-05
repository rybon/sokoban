import _ from 'lodash';
import Immutable from 'immutable';
import {
    createStore,
    applyMiddleware
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import appSaga from 'sagas';
import history from 'routes/history';
import {
    reducer as timeReducer
} from 'domains/time';
import {
    reducer as navigationReducer,
    middleware as createNavigationMiddleware
} from 'domains/navigation';
import {
    reducer as levelReducer
} from 'domains/level';
import {
    reducer as scoresReducer
} from 'domains/scores';
import {
    reducer as recorderReducer,
    middleware as recorderMiddleware
} from 'domains/recorder';

const reducers = {
    time: timeReducer,
    navigation: navigationReducer,
    level: levelReducer,
    scores: scoresReducer,
    recorder: recorderReducer
};

const appReducer = (state = Immutable.Map(), action) => {
    switch (action.type) {
        default:
            const newState = _.reduce(reducers, (currentState, reducer, key) => {
                return currentState.update(key, (stateSubtree) => reducer(stateSubtree, action));
            }, state);
            return newState;
    }
};

const navigationMiddleware = createNavigationMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const savedState = Immutable.fromJS(JSON.parse(global.localStorage.getItem('state'))) || Immutable.Map();

const store = createStore(appReducer, savedState, applyMiddleware(navigationMiddleware, sagaMiddleware, recorderMiddleware));

sagaMiddleware.run(appSaga);

global.onbeforeunload = () => {
    const stateToSave = store.getState().toJS();
    _.forEach(_.keys(stateToSave), (key) => key !== 'level' ? stateToSave[key] = undefined : null);
    global.localStorage.setItem('state', JSON.stringify(stateToSave));
};

export default store;
