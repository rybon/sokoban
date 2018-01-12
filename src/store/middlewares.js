import { routerMiddleware as createNavigationMiddleware } from 'connected-react-router/immutable'

export {
  default as interactionMiddleware
} from 'domains/interaction/middleware'
export { default as recorderMiddleware } from 'domains/recorder/middleware'
export { default as replayerMiddleware } from 'domains/replayer/middleware'

export { createNavigationMiddleware }
