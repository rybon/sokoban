import ActionTypes from './actionTypes'
import Constants from './constants'

const recorderMiddleware = store => {
  let ws = null
  let wsReady = false

  return next => action => {
    if (!ws && action.type === ActionTypes.START_RECORDING) {
      ws = new WebSocket(`ws://${global.location.host}${Constants.WS_ENDPOINT}`)

      ws.addEventListener('open', () => {
        wsReady = true

        const initialState = store.getState().toJS()
        initialState.recorder = null
        initialState.replayer = null
        initialState.navigation.locationBeforeTransitions.key = ''
        initialState.__META__ = {}
        initialState.__META__.timestamp = Date.now()

        global.__IS_RECORDING__ = true

        const startRecording = Constants.START_RECORDING_PAYLOAD
        startRecording.initialState = initialState

        ws.send(JSON.stringify(startRecording))
      })
    } else if (ws && wsReady && action.type === ActionTypes.STOP_RECORDING) {
      global.__IS_RECORDING__ = false

      const stopRecording = Constants.STOP_RECORDING_PAYLOAD
      stopRecording.name = action.payload
      stopRecording.impurities = {}
      stopRecording.impurities.nows = global.__RECORDED_NOWS__
      stopRecording.impurities.randoms = global.__RECORDED_RANDOMS__

      ws.send(JSON.stringify(stopRecording))
      ws.close()
      wsReady = false
      ws = null

      global.__RECORDED_NOWS__ = []
      global.__RECORDED_RANDOMS__ = []
    } else if (ws && wsReady) {
      const actionReference = action
      actionReference.__META__ = {}
      actionReference.__META__.timestamp = Date.now()

      ws.send(JSON.stringify(actionReference))
    }

    return next(action)
  }
}

export default recorderMiddleware
