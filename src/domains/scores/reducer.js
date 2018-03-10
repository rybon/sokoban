import Immutable from 'immutable'
import ActionTypes from './actionTypes'

const initialState = Immutable.fromJS({
  levels: {},
  backgroundImage:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAD1BMVEX/AAD/////Hx//X1//Pz9+syf5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQ0lEQVQ4jWNgGAWjgEaASYFBAZlGAGUnZWdkGgFcFAyYGRxYIDQKUHEBijAbQGhUwAyRAdOoekyUXUCmgelRMAqIAQDA7wdXRZzwIgAAAABJRU5ErkJggg=='
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
