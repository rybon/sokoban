import Immutable from 'immutable';
import ActionTypes from './ActionTypes';
import { PlayerOrientations, TileTypes } from './Constants';

const initialState = Immutable.fromJS({
    id: '',
    player: {
        x: 0,
        y: 0,
        orientation: PlayerOrientations.PLAYER_DOWN,
        playerMoves: 0,
        boxMoves: 0
    },
    boxes: [],
    tiles: [],
    previousState: null
});

const move = (state, x, y) => {
    const playerX = state.getIn(['player', 'x']);
    const playerY = state.getIn(['player', 'y']);
    const targetX = playerX + x;
    const targetY = playerY + y;
    const nextToTargetX = targetX + x;
    const nextToTargetY = targetY + y;
    const targetIsBox = state.getIn(['boxes', targetY, targetX]);
    const nextToTargetIsBox = state.getIn(['boxes', nextToTargetY, nextToTargetX]);
    const targetIsWall = state.getIn(['tiles', targetY, targetX]) === TileTypes.WALL;
    const nextTargetIsWall = state.getIn(['tiles', nextToTargetY, nextToTargetX]) === TileTypes.WALL;

    if (targetIsBox) {
        if (!nextToTargetIsBox && !nextTargetIsWall) {
            return state
                .set('previousState', state.set('previousState', null))
                .setIn(['boxes', targetY, targetX], false)
                .setIn(['boxes', nextToTargetY, nextToTargetX], true)
                .setIn(['player', 'boxMoves'], state.getIn(['player', 'boxMoves']) + 1)
                .setIn(['player', 'x'], targetX)
                .setIn(['player', 'y'], targetY)
                .setIn(['player', 'playerMoves'], state.getIn(['player', 'playerMoves']) + 1);
        } else {
            return state;
        }
    } else if (!targetIsWall) {
        return state
                .set('previousState', null)
                .setIn(['player', 'x'], targetX)
                .setIn(['player', 'y'], targetY)
                .setIn(['player', 'playerMoves'], state.getIn(['player', 'playerMoves']) + 1);
    } else {
        return state;
    }
};

const moveUp = (state) => (
    move(state, 0, -1).setIn(['player', 'orientation'], PlayerOrientations.PLAYER_UP)
);

const moveDown = (state) => (
    move(state, 0, 1).setIn(['player', 'orientation'], PlayerOrientations.PLAYER_DOWN)
);

const moveLeft = (state) => (
    move(state, -1, 0).setIn(['player', 'orientation'], PlayerOrientations.PLAYER_LEFT)
);

const moveRight = (state) => (
    move(state, 1, 0).setIn(['player', 'orientation'], PlayerOrientations.PLAYER_RIGHT)
);

const undo = (state) => (
    state.get('previousState') ? state.get('previousState') : state
);

const levelReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.RECEIVED_LEVEL:
            return initialState.mergeDeep(Immutable.fromJS(action.payload));
        case ActionTypes.GO_UP:
            return moveUp(state);
        case ActionTypes.GO_DOWN:
            return moveDown(state);
        case ActionTypes.GO_LEFT:
            return moveLeft(state);
        case ActionTypes.GO_RIGHT:
            return moveRight(state);
        case ActionTypes.UNDO:
            return undo(state);
        case ActionTypes.RESTART:
        case ActionTypes.JUMP_TO_LEVEL:
        case ActionTypes.RANDOM_LEVEL:
            return initialState;
        default:
            return state;
    }
};

export default levelReducer;
