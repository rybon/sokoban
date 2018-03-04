import ActionTypes from './actionTypes'

export const startRecording = () => ({
  type: ActionTypes.START_RECORDING
})

export const stopRecording = (name = '') => ({
  type: ActionTypes.STOP_RECORDING,
  payload: name
})
