import ActionTypes from './ActionTypes';

export const startReplaying = (name = '') => ({
    type: ActionTypes.START_REPLAYING,
    payload: name
});

export const stopReplaying = () => ({
    type: ActionTypes.STOP_REPLAYING
});

export const setInitialState = (initialState = {}) => ({
    type: ActionTypes.SET_INITIAL_STATE,
    payload: initialState
});
