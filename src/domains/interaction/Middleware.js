import * as ActionCreators from './actionCreators'
import ActionTypes from './actionTypes'
import Constants from './constants'

const interactionMiddleware = store => {
  let keyMaps = []
  let currentKeyMap = {}
  let suspendInteraction = false
  let rawSession = false

  const keyHandler = (keyEvent = new Event(Constants.EVENT_NAME)) => {
    if (suspendInteraction || rawSession) {
      return
    }

    if (currentKeyMap[keyEvent.code]) {
      keyEvent.preventDefault()
      store.dispatch(ActionCreators.keyPress(keyEvent))
    } else if (
      keyEvent.code === Constants.UP_CODE ||
      keyEvent.code === Constants.DOWN_CODE
    ) {
      keyEvent.preventDefault()
    }
  }

  global.document.addEventListener(Constants.EVENT_NAME, keyHandler)

  global.onbeforeunload = () => {
    global.document.removeEventListener(Constants.EVENT_NAME, keyHandler)
  }

  return next => (action, suspend, passthrough, isRawSession) => {
    suspendInteraction = suspend
    rawSession = isRawSession
    if (action.type === ActionTypes.BIND_KEYS && !passthrough) {
      keyMaps.push(action.payload)
      currentKeyMap = action.payload
      if (suspendInteraction && !passthrough) {
        return
      }
    } else if (action.type === ActionTypes.UNBIND_KEYS && !passthrough) {
      keyMaps = keyMaps.filter(keyMap => keyMap !== action.payload)
      currentKeyMap = keyMaps.length ? keyMaps[keyMaps.length - 1] : {}
      if (suspendInteraction && !passthrough) {
        return
      }
    } else if (action.type === ActionTypes.KEY_PRESS) {
      currentKeyMap[action.payload.code](action.payload)
    }

    return next(action)
  }
}

export default interactionMiddleware
