import Immutable from 'immutable'

export const currentViewState = (state = Immutable.Map()) =>
  state.getIn(['navigation', 'navigationStack']).last()

export const currentLocation = (state = Immutable.Map()) =>
  state.getIn(['navigation', 'locationBeforeTransitions'])
