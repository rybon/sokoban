const keyMaps = [];

let currentKeyMap = {};

const EVENT_NAME = 'keydown';

const UP_CODE = 'ArrowUp';
const DOWN_CODE = 'ArrowDown';

const keyHandler = (keyEvent = new Event(EVENT_NAME)) => {
    if (currentKeyMap[keyEvent.code]) {
        keyEvent.preventDefault();
        currentKeyMap[keyEvent.code](keyEvent);
    } else if (keyEvent.code === UP_CODE || keyEvent.code === DOWN_CODE) {
        keyEvent.preventDefault();
    }
};

export const bindKeys = (keyMap = {}) => {
    keyMaps.push(keyMap);
    currentKeyMap = keyMap;
};

export const unbindKeys = () => {
    keyMaps.pop();
    currentKeyMap = keyMaps.length ? keyMaps[keyMaps.length - 1] : {};
};

global.document.addEventListener(EVENT_NAME, keyHandler);

global.onbeforeunload = () => {
    global.document.removeEventListener(EVENT_NAME, keyHandler);
};
