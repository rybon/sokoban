import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import ActionTypes from './actionTypes'
import Constants from './constants'

const initialState = Immutable.fromJS({
  navigationStack: [{}],
  locationBeforeTransitions: null
})

const synchronizeNavigationStack = (state, action) => {
  if (action.payload.action === Constants.NEXT_LOCATION) {
    return state
      .set('locationBeforeTransitions', action.payload)
      .set(
        'navigationStack',
        state.get('navigationStack').push(Immutable.Map())
      )
  } else if (action.payload.action === Constants.PREVIOUS_LOCATION) {
    const newState = state
      .set('locationBeforeTransitions', action.payload)
      .set('navigationStack', state.get('navigationStack').pop())

    const lastIndex = newState.get('navigationStack').size - 1
    const selectedItemIndex = newState.getIn([
      'navigationStack',
      lastIndex,
      'selectedItemIndex'
    ])
    return newState.setIn(
      ['navigationStack', lastIndex],
      Immutable.fromJS({ selectedItemIndex })
    )
  }
  return state
}

const updateViewState = (state, action) => {
  const lastIndex = state.get('navigationStack').size - 1
  return state.setIn(
    ['navigationStack', lastIndex],
    state.getIn(['navigationStack', lastIndex]).merge(action.payload)
  )
}

const navigationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return synchronizeNavigationStack(state, action)
    case ActionTypes.UPDATE_VIEW_STATE:
      return updateViewState(state, action)
    default:
      return state
  }
}

export default navigationReducer
