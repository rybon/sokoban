import Immutable from 'immutable'

export const hasReplayer = (state = Immutable.Map()) => !!state.get('replayer')

export const isReplaying = (state = Immutable.Map()) =>
  !!state.getIn(['replayer', 'isReplaying'])
