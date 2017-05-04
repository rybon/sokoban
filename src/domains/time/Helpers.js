const prefixZero = (number) => (
    number < 10 ? `0${number}` : number
);

export const convertTimestampToClock = (timestamp) => {
    const date = new Date(timestamp);
    const hours = prefixZero(date.getHours());
    const minutes = prefixZero(date.getMinutes());
    return `${hours}:${minutes}`;
};
