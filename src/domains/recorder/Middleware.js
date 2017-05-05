import ActionTypes from './ActionTypes';
import Constants from './Constants';

let ws = null;
let wsReady = false;

const recorderMiddleware = store => next => action => {
    if (!ws && action.type === ActionTypes.START_RECORDING) {
        ws = new WebSocket('ws://' + global.location.host + Constants.WS_ENDPOINT);

        ws.addEventListener('open', (event) => {
            wsReady = true;

            const initialState = store.getState().toJS();
            initialState.recorder = null;
            ws.send(JSON.stringify({ initialState }, null, 4));
        });
    } else if (ws && wsReady && action.type === ActionTypes.STOP_RECORDING) {
        const stopRecording = Constants.STOP_RECORDING_PAYLOAD;
        stopRecording.name = action.payload;
        ws.send(JSON.stringify(stopRecording, null, 4));
        ws.close();
        wsReady = false;
        ws = null;
    } else if (ws && wsReady) {
        ws.send(JSON.stringify(action, null, 4));
    }

    return next(action);
};

export default recorderMiddleware;
