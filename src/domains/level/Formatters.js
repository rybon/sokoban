import _ from 'lodash'
import { convertAsciiValueToTileType } from './Helpers'
import { TileTypes } from './Constants'

export const formatLevel = (id = '0', rawLevel = []) => {
  const formattedLevel = {}
  formattedLevel.id = id
  formattedLevel.player = {
    x: 0,
    y: 0
  }
  formattedLevel.boxes = []
  formattedLevel.tiles = []
  _.forEach(rawLevel, (row, rowIndex) => {
    formattedLevel.boxes[rowIndex] = []
    formattedLevel.tiles[rowIndex] = []
    _.forEach(row.split(''), (column, columnIndex) => {
      let tileType = convertAsciiValueToTileType(column)
      if (
        tileType === TileTypes.PLAYER ||
        tileType === TileTypes.PLAYER_ON_DESTINATION
      ) {
        formattedLevel.player.x = columnIndex
        formattedLevel.player.y = rowIndex
        if (tileType === TileTypes.PLAYER) {
          tileType = TileTypes.FLOOR
        } else if (tileType === TileTypes.PLAYER_ON_DESTINATION) {
          tileType = TileTypes.DESTINATION
        }
      }
      if (
        tileType === TileTypes.BOX ||
        tileType === TileTypes.BOX_ON_DESTINATION
      ) {
        formattedLevel.boxes[rowIndex].push(true)
        if (tileType === TileTypes.BOX_ON_DESTINATION) {
          formattedLevel.tiles[rowIndex].push(TileTypes.DESTINATION)
        } else {
          formattedLevel.tiles[rowIndex].push(TileTypes.FLOOR)
        }
      } else {
        formattedLevel.boxes[rowIndex].push(false)
        formattedLevel.tiles[rowIndex].push(tileType)
      }
    })
  })

  return formattedLevel
}
