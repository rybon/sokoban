import _ from 'lodash'

const PATHS = {
  ROOT: '/',
  MAIN_MENU: 'MainMenu',
  LEVELS: 'Levels',
  HELP: 'Help',
  HIGH_SCORES: 'HighScores',
  SETTINGS: 'Settings'
}
const ROUTES = _.mapValues(
  PATHS,
  value => (value === PATHS.ROOT ? value : PATHS.ROOT + value)
)

export { PATHS, ROUTES }
