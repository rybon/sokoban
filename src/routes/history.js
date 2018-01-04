import { useRouterHistory } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory' // eslint-disable-line import/no-extraneous-dependencies

const history = useRouterHistory(createBrowserHistory)()

export default history
