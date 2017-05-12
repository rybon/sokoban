import ActionTypes from './ActionTypes';

export const bindKeys = (keyMap = {}) => ({
    type: ActionTypes.BIND_KEYS,
    payload: keyMap
});

export const unbindKeys = () => ({
    type: ActionTypes.UNBIND_KEYS
});

export const keyPress = (keyEvent = {}) => ({
    type: ActionTypes.KEY_PRESS,
    payload: keyEvent
});
