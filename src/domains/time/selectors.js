import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { convertTimestampToClock } from './helpers'

const timestamp = (state = Immutable.Map()) =>
  state.getIn(['time', 'timestamp'])

export const clock = createSelector([timestamp], currentTimestamp =>
  convertTimestampToClock(currentTimestamp)
)
