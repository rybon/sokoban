import ActionTypes from './actionTypes'

export const createLocalState = (localKey = 'local', initialState) => ({
  type: ActionTypes.CREATE_LOCAL_STATE,
  payload: {
    localKey,
    initialState
  }
})

export const updateLocalState = (localKey = 'local', newState) => ({
  type: ActionTypes.UPDATE_LOCAL_STATE,
  payload: {
    localKey,
    newState
  }
})

export const deleteLocalState = (localKey = 'local') => ({
  type: ActionTypes.DELETE_LOCAL_STATE,
  payload: {
    localKey
  }
})
