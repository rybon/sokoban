import ActionTypes from './actionTypes'

export const createOrUpdateLocalState = (localKey = 'local', localState) => ({
  type: ActionTypes.CREATE_OR_UPDATE_LOCAL_STATE,
  payload: {
    localKey,
    localState
  }
})

export const deleteLocalState = (localKey = 'local') => ({
  type: ActionTypes.DELETE_LOCAL_STATE,
  payload: {
    localKey
  }
})
