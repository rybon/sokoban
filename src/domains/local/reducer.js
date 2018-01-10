import Immutable from 'immutable'
import ActionTypes from './actionTypes'

const initialState = Immutable.fromJS({
  localStates: {}
})

const emptyState = Immutable.Map()

const createLocalState = (state, action) =>
  state.setIn(
    ['localStates', action.payload.localKey],
    action.payload.initialState
      ? Immutable.fromJS(action.payload.initialState)
      : emptyState
  )

const updateLocalState = (state, action) => {
  const localState =
    state.getIn(['localStates', action.payload.localKey]) || emptyState
  return state.setIn(
    ['localStates', action.payload.localKey],
    localState.merge(Immutable.fromJS(action.payload.newState))
  )
}

const deleteLocalState = (state, action) =>
  state.setIn(['localStates', action.payload.localKey], emptyState)

const localReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.CREATE_LOCAL_STATE:
      return createLocalState(state, action)
    case ActionTypes.UPDATE_LOCAL_STATE:
      return updateLocalState(state, action)
    case ActionTypes.DELETE_LOCAL_STATE:
      return deleteLocalState(state, action)
    default:
      return state
  }
}

export default localReducer
