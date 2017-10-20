import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { TileTypes } from './constants'

export const levelId = (state = Immutable.Map()) => state.getIn(['level', 'id'])

const player = (state = Immutable.Map()) => state.getIn(['level', 'player'])

const boxes = (state = Immutable.Map()) => state.getIn(['level', 'boxes'])

export const tiles = (state = Immutable.Map()) =>
  state.getIn(['level', 'tiles'])

const destinations = createSelector([tiles], tiles => {
  const destinations = []
  tiles.forEach((row, rowIndex) =>
    row.forEach((column, columnIndex) => {
      if (column === TileTypes.DESTINATION) {
        destinations.push({ x: columnIndex, y: rowIndex })
      }
    })
  )
  return Immutable.fromJS(destinations)
})

const getPlayer = (state = Immutable.Map(), props = {}) =>
  player(state).get('y') === props.rowIndex ? player(state) : null

const getBoxesRow = (state = Immutable.Map(), props = {}) =>
  boxes(state).get(props.rowIndex)

const getTilesRow = (state = Immutable.Map(), props = {}) =>
  tiles(state).get(props.rowIndex)

const defaultLevelRow = Immutable.List()

export const makeGetLevelRow = () =>
  createSelector(
    [getPlayer, getBoxesRow, getTilesRow],
    (player, boxesRow, tilesRow) =>
      tilesRow
        ? tilesRow.map((tile, tileIndex) => {
            if (player && player.get('x') === tileIndex) {
              return player.get('orientation')
            } else if (boxesRow.get(tileIndex)) {
              return tile === TileTypes.DESTINATION
                ? TileTypes.BOX_ON_DESTINATION
                : TileTypes.BOX
            } else {
              return tile
            }
          })
        : defaultLevelRow
  )

export const winCondition = createSelector(
  [destinations, boxes],
  (destinations, boxes) => {
    let win = !!destinations.size
    destinations.forEach(destination => {
      if (!boxes.getIn([destination.get('y'), destination.get('x')])) {
        win = false
      }
    })
    return win
  }
)

export const playerMoves = (state = Immutable.Map()) =>
  state.getIn(['level', 'player', 'playerMoves'])

export const boxMoves = (state = Immutable.Map()) =>
  state.getIn(['level', 'player', 'boxMoves'])
