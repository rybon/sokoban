import ActionTypes from './ActionTypes'

export const setAllScores = (scores = {}) => ({
  type: ActionTypes.SET_ALL_SCORES,
  payload: {
    levels: scores
  }
})

export const setScore = (id = '0', playerMoves = 0, boxMoves = 0) => ({
  type: ActionTypes.SET_SCORE,
  payload: {
    id,
    playerMoves,
    boxMoves
  }
})

export const removeScore = (id = '0') => ({
  type: ActionTypes.REMOVE_SCORE,
  payload: {
    id
  }
})

export const removeAllScores = () => ({
  type: ActionTypes.REMOVE_ALL_SCORES
})
