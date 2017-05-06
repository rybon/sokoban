import Immutable from 'immutable';
import ActionTypes from './ActionTypes';

const initialState = Immutable.fromJS({
    timestamp: 0
});

const timeReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case ActionTypes.TICK:
            return state.merge(action.payload);
        default:
            return state;
    }
};

export default timeReducer;
