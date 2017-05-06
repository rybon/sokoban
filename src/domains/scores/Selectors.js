import Immutable from 'immutable';

export const levelsScores = (state = Immutable.Map()) => (
    state.getIn(['scores', 'levels'])
);

export const bestPlayerMovesForLevel = (state = Immutable.Map(), id = '0') => (
    state.getIn(['scores', 'levels', id, 'playerMoves'])
);

export const bestBoxMovesForLevel = (state = Immutable.Map(), id = '0') => (
    state.getIn(['scores', 'levels', id, 'boxMoves'])
);
