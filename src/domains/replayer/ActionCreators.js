import ActionTypes from './ActionTypes'

export const startReplaying = (name = '', rawSession = false) => ({
  type: ActionTypes.START_REPLAYING,
  payload: {
    name,
    rawSession
  }
})

export const stopReplaying = () => ({
  type: ActionTypes.STOP_REPLAYING
})

export const setInitialState = (initialState = {}) => ({
  type: ActionTypes.SET_INITIAL_STATE,
  payload: initialState,
  __REPLAY__: true
})

export const replayDispatch = (payload = {}) => {
  payload.__REPLAY__ = true
  return payload
}
