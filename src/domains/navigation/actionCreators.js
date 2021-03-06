import { push, replace, go, goBack } from 'connected-react-router/immutable'

export const navigateTo = (pathname = '', search = '') =>
  push({ pathname, search })

export const navigateHere = (pathname = '', search = '') =>
  replace({ pathname, search })

export const navigateBack = (steps = 0) => (steps < 0 && go(steps)) || goBack()
