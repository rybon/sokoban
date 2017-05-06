import * as ActionCreators from './ActionCreators';
import ActionTypes from './ActionTypes';
import Constants from './Constants';

let ws = null;
let wsReady = false;

const replayerMiddleware = store => next => action => {
    if (!ws && action.type === ActionTypes.START_REPLAYING) {
        ws = new WebSocket('ws://' + global.location.host + Constants.WS_ENDPOINT);

        ws.addEventListener('open', (event) => {
            wsReady = true;

            const startReplaying = Constants.START_REPLAYING_PAYLOAD;
            startReplaying.name = action.payload;
            ws.send(JSON.stringify(startReplaying, null, 4));
        });
        ws.addEventListener('message', (message) => {
            const payload = JSON.parse(message.data);
            if (payload.initialState) {
                store.dispatch(ActionCreators.setInitialState(payload.initialState));
            } else if (payload.type) {
                store.dispatch(payload);
            } else if (payload.done) {
                store.dispatch(ActionCreators.stopReplaying());
            }
        });
    } else if (ws && wsReady && action.type === ActionTypes.STOP_REPLAYING) {
        ws.send(JSON.stringify(Constants.STOP_REPLAYING_PAYLOAD, null, 4));
        ws.close();
        wsReady = false;
        ws = null;
    }

    return next(action);
};

export default replayerMiddleware;
