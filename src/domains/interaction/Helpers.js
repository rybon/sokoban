export const convertPayloadValuesToBooleans = (payload = {}) => {
  const mapping = {}
  Object.keys(payload).forEach(key => {
    mapping[key] = true
  })
  return mapping
}
