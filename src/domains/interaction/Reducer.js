import Immutable from 'immutable'
import ActionTypes from './actionTypes'
import { convertPayloadValuesToBooleans } from './helpers'

const initialState = Immutable.fromJS({
  activeKeys: {}
})

const setActiveKeys = (state, action) => {
  return state.set(
    'activeKeys',
    Immutable.fromJS(convertPayloadValuesToBooleans(action.payload))
  )
}

const interactionReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ActionTypes.BIND_KEYS:
      return setActiveKeys(state, action)
    case ActionTypes.UNBIND_KEYS:
      return state.set('activeKeys', Immutable.Map())
    default:
      return state
  }
}

export default interactionReducer
