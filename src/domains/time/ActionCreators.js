import ActionTypes from './actionTypes'

export const tick = (timestamp = 0) => ({
  type: ActionTypes.TICK,
  payload: {
    timestamp
  }
})
