import Immutable from 'immutable'
import ActionTypes from './ActionTypes'

const initialState = Immutable.fromJS({
  levels: {},
  backgroundImage: 'https://dummyimage.com/600x400/ff0000/ffffff.png'
})

const setScore = (state, { payload: { id, playerMoves, boxMoves } }) => {
  const currentScore = state.getIn(['levels', `${id}`])
  const newScore = {}
  if (!currentScore || currentScore.get('playerMoves') > playerMoves) {
    newScore.playerMoves = playerMoves
  } else {
    newScore.playerMoves = currentScore.get('playerMoves')
  }
  if (!currentScore || currentScore.get('boxMoves') > boxMoves) {
    newScore.boxMoves = boxMoves
  } else {
    newScore.boxMoves = currentScore.get('boxMoves')
  }

  return state.setIn(['levels', `${id}`], Immutable.fromJS(newScore))
}

const removeScore = (state, { payload: { id } }) =>
  state.setIn(['levels', `${id}`], null)

const scoresReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.SET_ALL_SCORES:
      return initialState.mergeDeep(Immutable.fromJS(action.payload))
    case ActionTypes.SET_SCORE:
      return setScore(state, action)
    case ActionTypes.REMOVE_SCORE:
      return removeScore(state, action)
    case ActionTypes.REMOVE_ALL_SCORES:
      return initialState
    default:
      return state
  }
}

export default scoresReducer
