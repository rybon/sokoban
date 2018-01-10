import Immutable from 'immutable'

const emptyState = Immutable.Map()

export const localState = (state = Immutable.Map(), localKey = 'local') =>
  state.getIn(['local', 'localStates', localKey]) || emptyState
