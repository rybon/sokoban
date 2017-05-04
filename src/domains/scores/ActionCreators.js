import ActionTypes from './ActionTypes';

export const setAllScores = (scores) => ({
    type: ActionTypes.SET_ALL_SCORES,
    payload: {
        levels: scores
    }
});

export const setScore = (id, playerMoves, boxMoves) => ({
    type: ActionTypes.SET_SCORE,
    payload: {
        id,
        playerMoves,
        boxMoves
    }
});

export const removeScore = (id) => ({
    type: ActionTypes.REMOVE_SCORE,
    payload: {
        id
    }
});

export const removeAllScores = () => ({
    type: ActionTypes.REMOVE_ALL_SCORES
});
