global.__RECORDED_NOWS__ = [];

global.__RECORDED_RANDOMS__ = [];

export const now = () => {
    const timestamp = Date.now();
    if (global.__IS_RECORDING__) {
        global.__RECORDED_NOWS__.push(timestamp);
    } else if (global.__IS_REPLAYING__) {
        return global.__RECORDED_NOWS__.shift();
    }
    return timestamp;
};

export const random = () => {
    const number = Math.random();
    if (global.__IS_RECORDING__) {
        global.__RECORDED_RANDOMS__.push(number);
    } else if (global.__IS_REPLAYING__) {
        return global.__RECORDED_RANDOMS__.shift();
    }
    return number;
};
