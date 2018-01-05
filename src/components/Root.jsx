// @flow

import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import getRoutes from 'routes/index'
import type { Store } from 'redux'

type Props = {
  store: Store<*, *, *>,
  history: Object
}

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <Router history={history}>{getRoutes()}</Router>
  </Provider>
)

export default Root
