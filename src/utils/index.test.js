import { now, random } from './index'

describe('Utils', () => {
  global.__IS_REPLAYING__ = true
  global.__RECORDED_NOWS__ = [1508848094754]
  global.__RECORDED_RANDOMS__ = [0.7299404945485828]

  it('returns a Date.now value', () => {
    expect(now()).toBe(1508848094754)
  })

  it('returns a Math.random value', () => {
    expect(random()).toBe(0.7299404945485828)
  })
})
