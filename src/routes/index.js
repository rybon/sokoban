const PATHS = {
  ROOT: '/',
  MAIN_MENU: 'main-menu',
  LEVEL: 'levels/:id',
  HELP: 'help',
  HIGH_SCORES: 'high-scores',
  SETTINGS: 'settings'
}
const ROUTES = {}
Object.keys(PATHS).forEach(key => {
  ROUTES[key] =
    PATHS[key] === PATHS.ROOT ? PATHS[key] : `${PATHS.ROOT}${PATHS[key]}`
})

export default ROUTES
