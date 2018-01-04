import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import getRoutes from 'routes'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>{getRoutes()}</Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
    replaceReducer: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired
  }).isRequired,
  history: PropTypes.shape({
    getCurrentLocation: PropTypes.func.isRequired,
    listenBefore: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired,
    transitionTo: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    goForward: PropTypes.func.isRequired,
    createKey: PropTypes.func.isRequired,
    createPath: PropTypes.func.isRequired,
    createHref: PropTypes.func.isRequired,
    createLocation: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired
  }).isRequired
}

export default Root
