import { hello } from './hello'

describe('hello', () => {
  it('returns world', () => {
    expect(hello()).toBe('world')
  })
})