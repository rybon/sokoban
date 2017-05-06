import ActionTypes from './ActionTypes';

export const requestLevel = (id = '0') => ({
    type: ActionTypes.REQUEST_LEVEL,
    payload: {
        id
    }
});

export const receivedLevel = (level = {}) => ({
    type: ActionTypes.RECEIVED_LEVEL,
    payload: level
});

export const goUp = () => ({
    type: ActionTypes.GO_UP
});

export const goDown = () => ({
    type: ActionTypes.GO_DOWN
});

export const goLeft = () => ({
    type: ActionTypes.GO_LEFT
});

export const goRight = () => ({
    type: ActionTypes.GO_RIGHT
});

export const undo = () => ({
    type: ActionTypes.UNDO
});

export const restart = () => ({
    type: ActionTypes.RESTART
});

export const resume = () => ({
    type: ActionTypes.RESUME
});

export const nextLevel = () => ({
    type: ActionTypes.NEXT_LEVEL
});

export const jumpToLevel = (id = '0') => ({
    type: ActionTypes.JUMP_TO_LEVEL,
    payload: {
        id
    }
});

export const randomLevel = () => ({
    type: ActionTypes.RANDOM_LEVEL
});
