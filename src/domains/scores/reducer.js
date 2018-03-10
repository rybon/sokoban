import Immutable from 'immutable'
import ActionTypes from './actionTypes'

const initialState = Immutable.fromJS({
  levels: {},
  backgroundImage:
    'data:image/png;base64,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'
})

const setScore = (state, { payload: { id, playerMoves, boxMoves } }) => {
  const currentScore = state.getIn(['levels', `${id}`])
  const currentPlayerMoves = currentScore.get('playerMoves')
  const currentBoxMoves = currentScore.get('boxMoves')
  const newScore = {}
  if (!currentPlayerMoves || currentPlayerMoves > playerMoves) {
    newScore.playerMoves = playerMoves
  } else {
    newScore.playerMoves = currentPlayerMoves
  }
  if (!currentBoxMoves || currentBoxMoves > boxMoves) {
    newScore.boxMoves = boxMoves
  } else {
    newScore.boxMoves = currentBoxMoves
  }

  return state.setIn(['levels', `${id}`], Immutable.fromJS(newScore))
}

const emptyScore = Immutable.fromJS({
  playerMoves: null,
  boxMoves: null
})

const removeScore = (state, { payload: { id } }) =>
  state.setIn(['levels', `${id}`], emptyScore)

const removeAllScores = state =>
  state.set(
    'levels',
    state.get('levels').withMutations(levels => {
      let levelsReference = levels
      levelsReference
        .keySeq()
        .toArray()
        .forEach(level => {
          levelsReference = levelsReference.set(level, emptyScore)
        })
    })
  )

const scoresReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.SET_ALL_SCORES:
      return initialState.mergeDeep(Immutable.fromJS(action.payload))
    case ActionTypes.SET_SCORE:
      return setScore(state, action)
    case ActionTypes.REMOVE_SCORE:
      return removeScore(state, action)
    case ActionTypes.REMOVE_ALL_SCORES:
      return removeAllScores(state)
    default:
      return state
  }
}

export default scoresReducer
