// @flow

import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router/immutable'
import { Route, Switch } from 'react-router'
import { App, MainMenu, Level, Help, HighScores } from 'components/container'
import ROUTES from 'routes/index'

type Props = {
  store: any,
  history: any
}

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path={ROUTES.ROOT} component={MainMenu} />
          <Route path={ROUTES.LEVEL} component={Level} />
          <Route path={ROUTES.HELP} component={Help} />
          <Route path={ROUTES.HIGH_SCORES} component={HighScores} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>
)

export default Root
