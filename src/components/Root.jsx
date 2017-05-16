import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import getRoutes from 'routes'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      {getRoutes()}
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
