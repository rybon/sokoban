import keyMirror from './keymirror'

describe('keyMirror', () => {
  it('should namespace keys if given keys and a namespace', () => {
    expect(
      keyMirror({ KEY_ONE: null, KEY_TWO: null }, 'SomeNamespace')
    ).toEqual({
      KEY_ONE: 'KEY_ONE@SomeNamespace',
      KEY_TWO: 'KEY_TWO@SomeNamespace'
    })
  })

  it('should not namespace keys if only given keys', () => {
    expect(keyMirror({ KEY_ONE: null, KEY_TWO: null })).toEqual({
      KEY_ONE: 'KEY_ONE',
      KEY_TWO: 'KEY_TWO'
    })
  })
})
