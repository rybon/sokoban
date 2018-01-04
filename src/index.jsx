import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { syncHistoryWithStore } from 'react-router-redux'
import originalHistory from 'routes/history'
import store from 'store'
import Root from 'components/Root'

const history = syncHistoryWithStore(originalHistory, store, {
  selectLocationState: state => {
    const locationBeforeTransitions = state.getIn([
      'navigation',
      'locationBeforeTransitions'
    ])
    return {
      locationBeforeTransitions:
        locationBeforeTransitions && locationBeforeTransitions.toJS
          ? locationBeforeTransitions.toJS()
          : locationBeforeTransitions
    }
  }
})

const rootElement = global.document.getElementById('root')

const renderApp = RootComponent => {
  render(
    <AppContainer>
      <RootComponent store={store} history={history} />
    </AppContainer>,
    rootElement
  )
}

renderApp(Root)

if (module.hot) {
  module.hot.accept('./components/Root', () =>
    // eslint-disable-next-line global-require
    renderApp(require('./components/Root').default)
  )
}

if (/speedrun=1/.test(global.location.href)) {
  import(/* webpackChunkName: 'speedrun' */ 'speedrun')
    .then(speedrun => speedrun.default(store))
    .catch(error =>
      // eslint-disable-next-line no-console
      console.error(`An error occurred while loading the module: ${error}`)
    )
}
