import ActionTypes from './ActionTypes';

export const tick = (timestamp = 0) => ({
    type: ActionTypes.TICK,
    payload: {
        timestamp
    }
});
