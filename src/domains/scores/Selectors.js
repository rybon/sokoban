export const levelsScores = (state) => (
    state.getIn(['scores', 'levels'])
);

export const bestPlayerMovesForLevel = (state, id) => (
    state.getIn(['scores', 'levels', id, 'playerMoves'])
);

export const bestBoxMovesForLevel = (state, id) => (
    state.getIn(['scores', 'levels', id, 'boxMoves'])
);
