import replaysLeastNumberOfBoxMoves from 'replaysLeastNumberOfBoxMoves';
import replaysLeastNumberOfPlayerMoves from 'replaysLeastNumberOfPlayerMoves';

let replays = replaysLeastNumberOfBoxMoves;
let replayBothSessions = false;

let startingLevel = 1;
let waitMsBetweenLevels = 1500;
let waitMsBetweenSteps = 0;

export default function replay(store) {
    if (/type=box/.test(global.location.href)) {
        replays = replaysLeastNumberOfBoxMoves;
    } else if (/type=player/.test(global.location.href)) {
        replays = replaysLeastNumberOfPlayerMoves;
    } else if (/type=both/.test(global.location.href)) {
        replayBothSessions = true;
    }

    if (/level=(\d+)/.test(global.location.href)) {
        startingLevel = parseInt(/level=(\d+)/.exec(global.location.href)[1]);
        if (startingLevel < 1 || startingLevel > 100) {
            startingLevel = 1;
        }
    }

    if (/levelInterval=(\d+)/.test(global.location.href)) {
        waitMsBetweenLevels = parseInt(/levelInterval=(\d+)/.exec(global.location.href)[1]);
        if (waitMsBetweenLevels < 1500 || waitMsBetweenLevels > 10000) {
            waitMsBetweenLevels = 1500;
        }
    }

    if (/stepInterval=(\d+)/.test(global.location.href)) {
        waitMsBetweenSteps = parseInt(/stepInterval=(\d+)/.exec(global.location.href)[1]);
        if (waitMsBetweenSteps < 0 || waitMsBetweenSteps > 1000) {
            waitMsBetweenSteps = 0;
        }
    }

    store.dispatch({
        type: 'JUMP_TO_LEVEL@Level',
        payload: {
            id: startingLevel
        }
    });
    global.setTimeout(() => {
        steps(startingLevel, 0, store);
    }, waitMsBetweenLevels);
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
                }, waitMsBetweenLevels);
            } else {
                store.dispatch({
                    type: 'NEXT_LEVEL@Level'
                });
                if (replayBothSessions) {
                    replayBothSessions = false;
                    replays = replaysLeastNumberOfPlayerMoves;
                    global.setTimeout(() => {
                        steps(1, 0, store);
                    }, waitMsBetweenLevels);
                }
            }
        }
    }, waitMsBetweenSteps);
}
