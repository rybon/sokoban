import Immutable from 'immutable'
import ActionTypes from './ActionTypes'

const initialState = Immutable.fromJS({
  isReplaying: false
})

const replayerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.START_REPLAYING:
      return state ? state.set('isReplaying', true) : initialState
    case ActionTypes.STOP_REPLAYING:
      return state ? state.set('isReplaying', false) : initialState
    default:
      return state
  }
}

export default replayerReducer
