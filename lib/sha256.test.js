'use strict'

const test = require('ava')
const sha256 = require('./sha256')

test('should hash a string', t => {
  t.is(sha256('hello'), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
})

test('should hash a buffer', t => {
  t.is(sha256(Buffer.from('hello')), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
})

test('should return a random unique 64-character hex hash', t => {
  t.truthy(sha256())
  t.is(sha256().length, 64)
})
