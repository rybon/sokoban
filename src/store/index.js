import Immutable from 'immutable'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import history from 'routes/history'
import { bindKeys, keyPress } from 'domains/interaction/actionCreators'
import { convertPayloadValuesToBooleans } from 'domains/interaction/helpers'
import { LOCATION_CHANGE } from 'react-router-redux'
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
      return currentReducersArray.reduce((currentState, key) => {
        return currentState.update(key, stateSubtree =>
          currentReducers[key](stateSubtree, action)
        )
      }, state)
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
    let delegate = middleware(store)(next)

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
    let delegate = middleware(store)(next)

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
          task.cancel()
          task.done.then(() => {
            running = false
          })
        }
        return next(action) // skip if paused
      } else {
        if (task && task.isCancelled() && !running) {
          task.done.then(() => {
            running = true
            task = sagaMiddleware.run(currentAppSaga)
          })
        }
        return delegate(action)
      }
    }
  }
}

const filterRecorderMiddleware = middleware => {
  return store => next => {
    let delegate = middleware(store)(next)

    return action => {
      if (action.type === bindKeys().type) {
        action.payload = convertPayloadValuesToBooleans(action.payload)
      } else if (action.type === LOCATION_CHANGE) {
        action.payload.key = ''
      } else if (action.type === keyPress().type) {
        action.payload = { code: action.payload.code }
      } else if (action.type === stopReplaying().type) {
        store.dispatch(stopRecording())
      }
      return delegate(action)
    }
  }
}

const appMiddleware = applyMiddleware(
  pauseResumeInteractionMiddleware(interactionMiddleware),
  navigationMiddleware,
  pauseResumeSagaMiddleware(sagaMiddleware),
  filterRecorderMiddleware(recorderMiddleware),
  replayerMiddleware
)

const store = createStore(appReducer, savedState, appMiddleware)

task = sagaMiddleware.run(currentAppSaga)

global.onbeforeunload = () => {
  const stateToSave = store.getState().toJS()
  Object.keys(stateToSave).forEach(
    key => (key !== 'level' ? (stateToSave[key] = undefined) : null)
  )
  global.localStorage.setItem('state', JSON.stringify(stateToSave))
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  global.__STORE__ = store
}

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducers = require('./reducers').default
    const nextReducersArray = Object.keys(nextReducers)
    const nextAppReducer = getAppReducer(nextReducers, nextReducersArray)

    store.replaceReducer(nextAppReducer)
  })

  module.hot.accept('./sagas', () => {
    currentAppSaga = require('./sagas').default

    task.cancel()
    task.done.then(() => {
      task = sagaMiddleware.run(currentAppSaga)
    })
  })
}

export default store
