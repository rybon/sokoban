import { createSelector } from 'reselect';
import { convertTimestampToClock } from './Helpers';

const timestamp = (state) => (
    state.getIn(['time', 'timestamp'])
);

export const clock = createSelector(
    [timestamp],
    (timestamp) => (
        convertTimestampToClock(timestamp)
    )
);
