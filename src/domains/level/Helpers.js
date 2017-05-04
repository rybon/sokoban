import { ASCII_VALUE_TO_TILE_TYPE } from './Constants';

export const convertAsciiValueToTileType = (asciiValue) => (ASCII_VALUE_TO_TILE_TYPE[asciiValue]);

export const randomNumberFromRange = (random, min, max) => (
    Math.floor(random * (max - min + 1)) + min
);
