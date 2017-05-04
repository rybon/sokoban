const keyMaps = [];

let currentKeyMap = {};

const keyHandler = (keyEvent) => {
    if (currentKeyMap[keyEvent.code]) {
        keyEvent.preventDefault();
        currentKeyMap[keyEvent.code](keyEvent);
    }
};

export const bindKeys = (keyMap) => {
    keyMaps.push(keyMap);
    currentKeyMap = keyMap;
};

export const unbindKeys = () => {
    keyMaps.pop();
    currentKeyMap = keyMaps.length ? keyMaps[keyMaps.length - 1] : {};
};

const EVENT_NAME = 'keydown';

document.addEventListener(EVENT_NAME, keyHandler);

global.onbeforeunload = () => {
    document.removeEventListener(EVENT_NAME, keyHandler);
};
