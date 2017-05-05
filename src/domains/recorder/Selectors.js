export const hasRecorder = (state) => (
    state.get('recorder')
);

export const isRecording = (state) => (
    state.getIn(['recorder', 'isRecording'])
);
