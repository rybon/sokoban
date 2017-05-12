import Immutable from 'immutable';

export const activeKeys = (state = Immutable.Map()) => (
    state.getIn(['interaction', 'activeKeys'])
);
