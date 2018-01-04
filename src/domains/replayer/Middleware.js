import * as ActionCreators from './actionCreators'
import ActionTypes from './actionTypes'
import Constants from './constants'

const replayerMiddleware = store => {
  let ws = null
  let wsReady = false

  return next => action => {
    if (global.__IS_HEADLESS_BROWSER__) {
      return next(action)
    }

    if (!ws && action.type === ActionTypes.START_REPLAYING) {
      ws = new WebSocket(`ws://${global.location.host}${Constants.WS_ENDPOINT}`)

      ws.addEventListener('open', () => {
        wsReady = true

        const startReplaying = Constants.START_REPLAYING_PAYLOAD
        startReplaying.name = action.payload.name
        startReplaying.rawSession = action.payload.rawSession
        ws.send(JSON.stringify(startReplaying))
      })
      ws.addEventListener('message', message => {
        const payload = JSON.parse(message.data)
        if (payload.initialState) {
          global.__IS_REPLAYING__ = true

          global.__RECORDED_NOWS__ = payload.impurities.nows
          global.__RECORDED_RANDOMS__ = payload.impurities.randoms

          store.dispatch(ActionCreators.setInitialState(payload.initialState))
        } else if (payload.type) {
          store.dispatch(ActionCreators.replayDispatch(payload))
        } else if (payload.done) {
          global.__IS_REPLAYING__ = false

          global.__RECORDED_NOWS__ = []
          global.__RECORDED_RANDOMS__ = []

          store.dispatch(ActionCreators.stopReplaying())
        }
      })
    } else if (ws && wsReady && action.type === ActionTypes.STOP_REPLAYING) {
      ws.send(JSON.stringify(Constants.STOP_REPLAYING_PAYLOAD))
      ws.close()
      wsReady = false
      ws = null
    }

    return next(action)
  }
}

export default replayerMiddleware
