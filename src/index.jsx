import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import store from 'store'
import history from 'routes/history'
import Root from 'components/Root'

const installServiceWorker = () => {
  if ('serviceWorker' in global.navigator) {
    global.navigator.serviceWorker // eslint-disable-line compat/compat
      .register('/service-worker.js', { scope: '/' })
      .then(() => console.log('Service Worker registered successfully.')) // eslint-disable-line no-console
      .catch(error => console.log('Service Worker registration failed:', error)) // eslint-disable-line no-console
  }
}

if (process.env.NODE_ENV === 'production') {
  installServiceWorker()
} else if (process.env.NODE_ENV === 'development') {
  global.navigator.serviceWorker.getRegistrations().then(registrations => {
    // eslint-disable-next-line no-restricted-syntax
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

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
