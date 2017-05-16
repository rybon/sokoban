import Immutable from 'immutable'

export const currentViewState = (state = Immutable.Map()) =>
  state.getIn(['navigation', 'navigationStack']).last()

export const currentQuery = (state = Immutable.Map()) =>
  state.getIn(['navigation', 'locationBeforeTransitions']).query
