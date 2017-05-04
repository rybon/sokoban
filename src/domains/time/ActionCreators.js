import ActionTypes from './ActionTypes';

export const tick = (timestamp) => ({
    type: ActionTypes.TICK,
    payload: {
        timestamp
    }
});
