import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'connected-react-router/immutable'

const initialState = Immutable.fromJS({
  location: null
})

const navigationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.mergeDeep(Immutable.fromJS(action.payload))
    default:
      return state
  }
}

export default navigationReducer
