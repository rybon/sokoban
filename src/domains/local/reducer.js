import Immutable from 'immutable'
import ActionTypes from './actionTypes'

const initialState = Immutable.fromJS({
  localStates: {}
})

const emptyState = Immutable.Map()

const createOrUpdateLocalState = (state, action) => {
  const localState =
    state.getIn(['localStates', action.payload.localKey]) || emptyState
  return state.setIn(
    ['localStates', action.payload.localKey],
    localState.merge(Immutable.fromJS(action.payload.localState))
  )
}

const deleteLocalState = (state, action) =>
  state.setIn(['localStates', action.payload.localKey], emptyState)

const localReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.CREATE_OR_UPDATE_LOCAL_STATE:
      return createOrUpdateLocalState(state, action)
    case ActionTypes.DELETE_LOCAL_STATE:
      return deleteLocalState(state, action)
    default:
      return state
  }
}

export default localReducer
