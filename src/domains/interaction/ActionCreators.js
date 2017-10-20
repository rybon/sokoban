import ActionTypes from './actionTypes'

export const bindKeys = (keyMap = {}) => ({
  type: ActionTypes.BIND_KEYS,
  payload: keyMap
})

export const unbindKeys = (keyMap = {}) => ({
  type: ActionTypes.UNBIND_KEYS,
  payload: keyMap
})

export const keyPress = (keyEvent = {}) => ({
  type: ActionTypes.KEY_PRESS,
  payload: keyEvent
})
