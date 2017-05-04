import replays from 'replaysLeastNumberOfBoxMoves';

const STARTING_LEVEL = 1;
const WAIT_MS_BETWEEN_LEVELS = 1500;
const WAIT_MS_BETWEEN_STEPS = 0;

export default function replay(store) {
    store.dispatch({
        type: 'JUMP_TO_LEVEL@Level',
        payload: {
            id: STARTING_LEVEL
        }
    });
    global.setTimeout(() => {
        steps(STARTING_LEVEL, 0, store);
    }, WAIT_MS_BETWEEN_LEVELS);
}

function steps(level, step, store) {
    let interval = global.setInterval(() => {
        if (replays['' + level][step]) {
            store.dispatch(replays['' + level][step]);
            step = step + 1;
        } else {
            global.clearInterval(interval);
            if ((level + 1) < 101) {
                store.dispatch({
                    type: 'NEXT_LEVEL@Level'
                });
                global.setTimeout(() => {
                    steps(level + 1, 0, store);
                }, WAIT_MS_BETWEEN_LEVELS);
            } else {
                store.dispatch({
                    type: 'NEXT_LEVEL@Level'
                });
            }
        }
    }, WAIT_MS_BETWEEN_STEPS);
}
