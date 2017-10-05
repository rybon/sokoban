import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './components/Root'
import { syncHistoryWithStore } from 'react-router-redux'
import originalHistory from 'routes/history'
import store from 'store'

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
    renderApp(require('./components/Root').default)
  )
}

if (/speedrun=1/.test(global.location.href)) {
  import(/* webpackChunkName: 'speedrun' */ 'speedrun')
    .then(speedrun => speedrun.default(store))
    .catch(error =>
      console.error('An error occurred while loading the module.')
    )
}
