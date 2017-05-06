import { ASCII_VALUE_TO_TILE_TYPE } from './Constants';

export const convertAsciiValueToTileType = (asciiValue = '') => (ASCII_VALUE_TO_TILE_TYPE[asciiValue]);

export const randomNumberFromRange = (random = 0.0, min = 0, max = 0) => (
    Math.floor(random * (max - min + 1)) + min
);
