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
import {
    reducer as replayerReducer,
    middleware as replayerMiddleware,
    ActionCreators as ReplayerActionCreators
} from 'domains/replayer';

const reducers = {
    time: timeReducer,
    navigation: navigationReducer,
    level: levelReducer,
    scores: scoresReducer,
    recorder: recorderReducer,
    replayer: replayerReducer
};

const appReducer = (state = Immutable.Map(), action = {}) => {
    switch (action.type) {
        case ReplayerActionCreators.setInitialState().type:
            return Immutable.fromJS(action.payload);
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

let task = null;

const pauseResumeMiddleware = (middleware) => {
    let paused = false;
    return store => next => {
        let delegate = middleware(store)(next);

        return action => {
            if (action.type === ReplayerActionCreators.startReplaying().type) {
                paused = true;
            } else if (action.type === ReplayerActionCreators.stopReplaying().type) {
                paused = false;
            }
            if (paused) {
                if (task && task.isRunning()) {
                    task.cancel();
                }
                return next(action); // skip if paused
            } else {
                if (task && task.isCancelled()) {
                    task = sagaMiddleware.run(appSaga);
                }
                return delegate(action);
            }
        };
    };
};

const store = createStore(appReducer, savedState, applyMiddleware(navigationMiddleware, pauseResumeMiddleware(sagaMiddleware), recorderMiddleware, replayerMiddleware));

task = sagaMiddleware.run(appSaga);

global.onbeforeunload = () => {
    const stateToSave = store.getState().toJS();
    _.forEach(_.keys(stateToSave), (key) => key !== 'level' ? stateToSave[key] = undefined : null);
    global.localStorage.setItem('state', JSON.stringify(stateToSave));
};

export default store;
