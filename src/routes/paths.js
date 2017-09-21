const PATHS = {
  ROOT: '/',
  MAIN_MENU: 'MainMenu',
  LEVELS: 'Levels',
  HELP: 'Help',
  HIGH_SCORES: 'HighScores',
  SETTINGS: 'Settings'
}
const ROUTES = {}
Object.keys(PATHS).forEach(key => {
  ROUTES[key] = PATHS[key] === PATHS.ROOT ? PATHS[key] : PATHS.ROOT + PATHS[key]
})

export { PATHS, ROUTES }
