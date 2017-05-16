import Immutable from 'immutable'
import ActionTypes from './ActionTypes'

const initialState = Immutable.fromJS({
  isRecording: false
})

const recorderReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.START_RECORDING:
      return state ? state.set('isRecording', true) : initialState
    case ActionTypes.STOP_RECORDING:
      return state ? state.set('isRecording', false) : initialState
    default:
      return state
  }
}

export default recorderReducer
