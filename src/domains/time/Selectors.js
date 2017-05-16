import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { convertTimestampToClock } from './Helpers'

const timestamp = (state = Immutable.Map()) =>
  state.getIn(['time', 'timestamp'])

export const clock = createSelector([timestamp], timestamp =>
  convertTimestampToClock(timestamp)
)
