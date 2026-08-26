import { describe, expect, it } from 'vitest'
import { reveal } from '../src/utils/secret'

describe('reveal', () => {
  it('decodes the obfuscated QQ id', () => {
    expect(reveal('VFxRVFBfUVVeWg==')).toBe('3169726897')
  })

  it('decodes the obfuscated WeChat id', () => {
    expect(reveal('EAEEHh4KAwsQ')).toBe('wlcsygdfw')
  })

  it('round-trips arbitrary ascii through the xor scheme', () => {
    const key = 'gm'
    const input = 'hello-world-123'
    const encoded = Buffer.from(
      [...Buffer.from(input)].map((b, i) => b ^ key.charCodeAt(i % key.length))
    ).toString('base64')
    expect(reveal(encoded)).toBe(input)
  })

  it('returns empty string for malformed base64', () => {
    expect(reveal('!!!not-base64!!!')).toBe('')
  })
})
