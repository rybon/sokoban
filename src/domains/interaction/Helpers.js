import _ from 'lodash'

export const convertPayloadValuesToBooleans = (payload = {}) => {
  const mapping = {}
  _.forEach(_.keys(payload), key => {
    mapping[key] = true
  })
  return mapping
}
