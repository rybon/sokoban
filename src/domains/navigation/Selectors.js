import Immutable from 'immutable'

export const currentLocation = (state = Immutable.Map()) =>
  state.getIn(['navigation', 'location'])
