'use strict'

const { serial: test } = require('ava')
const sha256 = require('./sha256')

const IdShortener = require('..')

module.exports = (client, name) => {
  test.beforeEach(async () => { await client.flushall() })
  test.after(async () => { await client.quit() })

  test(`${name} - basic functionality`, async t => {
    const shortener = new IdShortener({
      client
    })

    const longId0 = sha256()
    const shortId0 = await shortener.shorten(longId0)

    t.is(shortId0, '1')
    t.truthy(longId0.length > shortId0.length)
    t.truthy(shortId0.length > 0)
    t.truthy(shortId0.length < 8)

    t.is(longId0, await shortener.expand(shortId0))
  })

  test(`${name} - shorten idempotent`, async t => {
    const shortener = new IdShortener({
      client
    })

    for (let i = 0; i < 360; ++i) {
      const longId0 = sha256(`test-${i}`)
      const shortId0 = await shortener.shorten(longId0)
      const shortId1 = await shortener.shorten(longId0)

      t.is(shortId0, shortId1)
    }
  })

  test(`${name} - shorten not idempotent`, async t => {
    const shortener = new IdShortener({
      client,
      idempotent: false
    })

    const longId0 = sha256()
    const shortId0 = await shortener.shorten(longId0)
    const shortId1 = await shortener.shorten(longId0)

    t.not(shortId0, shortId1)

    t.is(longId0, await shortener.expand(shortId0))
    t.is(longId0, await shortener.expand(shortId1))
  })

  test(`${name} - expand with non-existent longId should return null`, async t => {
    const shortener = new IdShortener({
      client
    })

    t.is(null, await shortener.expand('missing'))
  })

  test(`${name} - multiple unique long ids should return unique short ids`, async t => {
    const shortener = new IdShortener({
      client
    })

    const shortIds = new Set()

    for (let i = 0; i < 100; ++i) {
      const longId0 = sha256(`test-${i}`)
      const shortId = await shortener.shorten(longId0)

      t.truthy(shortId.length < 8)
      t.falsy(shortIds.has(shortId))

      shortIds.add(shortId)
    }
  })

  test(`${name} - multiple unique shorten and expand should work together`, async t => {
    const shortener = new IdShortener({
      client
    })

    for (let i = 0; i < 270; ++i) {
      const longId0 = sha256(`test-${i}`)
      const shortId = await shortener.shorten(longId0)

      t.truthy(shortId.length > 0)
      t.truthy(shortId.length < 8)

      t.is(longId0, await shortener.expand(shortId))
    }
  })

  test(`${name} - custom ascii character set`, async t => {
    const characters = '01-$.'
    const characterSet = new Set(characters.split(''))

    const shortener = new IdShortener({
      characters,
      client
    })

    for (let i = 0; i < 270; ++i) {
      const longId0 = sha256(`test-${i}`)
      const shortId = await shortener.shorten(longId0)

      t.truthy(shortId.length > 0)

      shortId.split('').forEach(c => {
        t.truthy(characterSet.has(c))
      })
    }
  })
}
