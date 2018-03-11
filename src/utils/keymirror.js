// @flow

export default function keyMirror(keys: Object, namespace?: string): Object {
  const outputKeys = {}

  Object.keys(keys).forEach(key => {
    if (namespace) {
      outputKeys[key] = `${key}@${namespace}`
    } else {
      outputKeys[key] = key
    }
  })

  return outputKeys
}
