export const NUMBER_OF_LEVELS = 100;

export const TileTypes = {
    BACKGROUND: 'background',
    WALL: 'wall',
    FLOOR: 'floor',
    DESTINATION: 'destination',
    BOX: 'box',
    BOX_ON_DESTINATION: 'boxOnDestination',
    PLAYER: 'playerDown',
    PLAYER_ON_DESTINATION: 'playerOnDestination'
};

export const ASCII_VALUE_TO_TILE_TYPE = {
    ' ': TileTypes.BACKGROUND,
    '#': TileTypes.WALL,
    '_': TileTypes.FLOOR,
    '.': TileTypes.DESTINATION,
    '$': TileTypes.BOX,
    '*': TileTypes.BOX_ON_DESTINATION,
    '@': TileTypes.PLAYER,
    '+': TileTypes.PLAYER_ON_DESTINATION
};

export const PlayerOrientations = {
    PLAYER_UP: 'playerUp',
    PLAYER_DOWN: 'playerDown',
    PLAYER_LEFT: 'playerLeft',
    PLAYER_RIGHT: 'playerRight'
};
