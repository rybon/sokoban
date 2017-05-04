import Immutable from 'immutable';
import { createSelector } from 'reselect';
import { TileTypes } from './Constants';

export const levelId = (state) => (
    state.getIn(['level', 'id'])
);

const player = (state) => (
    state.getIn(['level', 'player'])
);

const boxes = (state) => (
    state.getIn(['level', 'boxes'])
);

export const tiles = (state) => (
    state.getIn(['level', 'tiles'])
);

const destinations = createSelector(
    [tiles],
    (tiles) => {
        const destinations = [];
        tiles.forEach(
            (row, rowIndex) => row.forEach(
                (column, columnIndex) => {
                    if (column === TileTypes.DESTINATION) {
                        destinations.push({ x: columnIndex, y: rowIndex });
                    }
                }
            )
        );
        return Immutable.fromJS(destinations);
    }
);

const getPlayer = (state, props) => (
    player(state).get('y') === props.rowIndex ? player(state) : null
);

const getBoxesRow = (state, props) => (
    boxes(state).get(props.rowIndex)
);

const getTilesRow = (state, props) => (
    tiles(state).get(props.rowIndex)
);

const defaultLevelRow = Immutable.List();

export const makeGetLevelRow = () => (
    createSelector(
        [getPlayer, getBoxesRow, getTilesRow],
        (player, boxesRow, tilesRow) => (
            tilesRow ? tilesRow.map((tile, tileIndex) => {
                if (player && player.get('x') === tileIndex) {
                    return player.get('orientation');
                } else if (boxesRow.get(tileIndex)) {
                    return tile === TileTypes.DESTINATION ? TileTypes.BOX_ON_DESTINATION : TileTypes.BOX;
                } else {
                    return tile;
                }
            }) : defaultLevelRow
        )
    )
);

export const winCondition = createSelector(
    [destinations, boxes],
    (destinations, boxes) => {
        let win = !!destinations.size;
        destinations.forEach((destination) => {
            if (!boxes.getIn([destination.get('y'), destination.get('x')])) {
                win = false;
            }
        });
        return win;
    }
);

export const playerMoves = (state) => (
    state.getIn(['level', 'player', 'playerMoves'])
);

export const boxMoves = (state) => (
    state.getIn(['level', 'player', 'boxMoves'])
);
