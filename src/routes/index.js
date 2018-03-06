const PATHS = {
  ROOT: '/',
  LEVEL: 'levels/:id',
  HELP: 'help',
  HIGH_SCORES: 'high-scores'
}
const ROUTES = {}
Object.keys(PATHS).forEach(key => {
  ROUTES[key] =
    PATHS[key] === PATHS.ROOT ? PATHS[key] : `${PATHS.ROOT}${PATHS[key]}`
})

export default ROUTES
