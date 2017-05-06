import Immutable from 'immutable';

export const hasRecorder = (state = Immutable.Map()) => (
    state.get('recorder')
);

export const isRecording = (state = Immutable.Map()) => (
    state.getIn(['recorder', 'isRecording'])
);
