import Immutable from 'immutable'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import history from 'routes/history'
import { bindKeys, keyPress } from 'domains/interaction/actionCreators'
import { convertPayloadValuesToBooleans } from 'domains/interaction/helpers'
import {
  connectRouter,
  LOCATION_CHANGE
} from 'connected-react-router/immutable'
import { stopRecording } from 'domains/recorder/actionCreators'
import {
  startReplaying,
  stopReplaying,
  setInitialState
} from 'domains/replayer/actionCreators'
import reducers from './reducers'
import appSaga from './sagas'
import {
  interactionMiddleware,
  recorderMiddleware,
  replayerMiddleware,
  createNavigationMiddleware
} from './middlewares'

let currentAppSaga = appSaga

const reducersArray = Object.keys(reducers)

const getAppReducer = (currentReducers, currentReducersArray) => (
  state = Immutable.Map(),
  action = {}
) => {
  switch (action.type) {
    case setInitialState().type:
      return Immutable.fromJS(action.payload)
    default:
      return currentReducersArray.reduce(
        (currentState, key) =>
          currentState.update(key, stateSubtree =>
            currentReducers[key](stateSubtree, action)
          ),
        state
      )
  }
}

const appReducer = getAppReducer(reducers, reducersArray)

const navigationMiddleware = createNavigationMiddleware(history)
const sagaMiddleware = createSagaMiddleware()
const savedState =
  Immutable.fromJS(JSON.parse(global.localStorage.getItem('state'))) ||
  Immutable.Map()

const pauseResumeInteractionMiddleware = middleware => {
  let paused = false
  let rawSession = false
  return store => next => {
    const delegate = middleware(store)(next)

    return action => {
      if (action.type === startReplaying().type) {
        if (action.payload.rawSession) {
          rawSession = true
        } else {
          paused = true
        }
      } else if (action.type === stopReplaying().type) {
        paused = false
        rawSession = false
      }
      return delegate(action, paused, action.__REPLAY__, rawSession)
    }
  }
}

let task = null

const pauseResumeSagaMiddleware = middleware => {
  let paused = false
  let running = true
  return store => next => {
    const delegate = middleware(store)(next)

    return action => {
      if (action.type === startReplaying().type) {
        if (!action.payload.rawSession) {
          paused = true
        }
      } else if (action.type === stopReplaying().type) {
        paused = false
      }

      if (paused) {
        if (task && task.isRunning()) {
          running = false
          task.cancel()
        }
        return next(action) // skip if paused
      }
      if (task && task.isCancelled() && !running) {
        running = true
        task = sagaMiddleware.run(currentAppSaga)
      }
      return delegate(action)
    }
  }
}

const filterRecorderMiddleware = middleware => store => next => {
  const delegate = middleware(store)(next)

  return action => {
    const actionReference = action
    if (actionReference.type === bindKeys().type) {
      actionReference.payload = convertPayloadValuesToBooleans(
        actionReference.payload
      )
    } else if (actionReference.type === LOCATION_CHANGE) {
      actionReference.payload.location.key = ''
    } else if (actionReference.type === keyPress().type) {
      actionReference.payload = { code: actionReference.payload.code }
    } else if (actionReference.type === stopReplaying().type) {
      store.dispatch(stopRecording())
    }
    return delegate(actionReference)
  }
}

const appMiddleware = applyMiddleware(
  pauseResumeInteractionMiddleware(interactionMiddleware),
  navigationMiddleware,
  pauseResumeSagaMiddleware(sagaMiddleware),
  filterRecorderMiddleware(recorderMiddleware),
  replayerMiddleware
)

const store = createStore(
  connectRouter(history)(appReducer),
  savedState,
  appMiddleware
)

task = sagaMiddleware.run(currentAppSaga)

global.onbeforeunload = () => {
  const stateToSave = store.getState().toJS()
  Object.keys(stateToSave).forEach(key => {
    if (key !== 'level') {
      stateToSave[key] = undefined
    }
  })
  global.localStorage.setItem('state', JSON.stringify(stateToSave))
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  global.__STORE__ = store
}

if (module.hot) {
  module.hot.accept('./reducers', () => {
    // eslint-disable-next-line global-require
    const nextReducers = require('./reducers').default
    const nextReducersArray = Object.keys(nextReducers)
    const nextAppReducer = getAppReducer(nextReducers, nextReducersArray)

    store.replaceReducer(connectRouter(history)(nextAppReducer))
  })

  module.hot.accept('./sagas', () => {
    // eslint-disable-next-line global-require
    currentAppSaga = require('./sagas').default

    task.cancel()
    task.done.then(() => {
      task = sagaMiddleware.run(currentAppSaga)
    })
  })
}

export default store
