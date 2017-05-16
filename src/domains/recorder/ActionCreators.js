import ActionTypes from './ActionTypes'

export const startRecording = () => ({
  type: ActionTypes.START_RECORDING
})

export const stopRecording = (name = '') => ({
  type: ActionTypes.STOP_RECORDING,
  payload: name
})
