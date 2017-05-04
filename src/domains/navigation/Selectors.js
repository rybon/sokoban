export const currentViewState = (state) => (
    state.getIn(['navigation', 'navigationStack']).last()
);

export const currentQuery = (state) => (
    state.getIn(['navigation', 'locationBeforeTransitions']).query
);
