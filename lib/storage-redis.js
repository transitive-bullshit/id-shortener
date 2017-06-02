'use strict'

const Storage = require('./storage')
const dedent = require('dedent')

class StorageRedis extends Storage {
  constructor (opts) {
    const context = Object.assign({
      shortToLongKey: 'id-shortener:short-to-long',
      longToShortKey: 'id-shortener:long-to-short',
      sequenceKey: 'id-shortener:sequence'
    }, opts)

    super(context)

    const {
      characters,
      idempotent
    } = this._opts

    const numCharacters = characters.length

    const prefix = (idempotent ? `
        local value = redis.call('hget', KEYS[3], ARGV[1])

        if (value) then
          return value
        end
    ` : '')

    const suffix = (idempotent ? `
        redis.call('hset', KEYS[3], ARGV[1], slug)
    ` : '')

    // maps incremental sequence integer => base60 string
    // note that the length of the resulting shortIds will grow in proportion to
    // the number of mappings, but the length will grow very, very slowly
    this._command = {
      numberOfKeys: 3,
      lua: dedent`
        ${prefix}
        local sequence = redis.call('incr', KEYS[1])

        local chars = '${characters}'
        local remaining = sequence
        local slug = ''

        while (remaining > 0) do
          local d = (remaining % ${numCharacters})
          local character = string.sub(chars, d + 1, d + 1)

          slug = character .. slug
          remaining = (remaining - d) / ${numCharacters}
        end

        redis.call('hset', KEYS[2], slug, ARGV[1])
        ${suffix}

        return slug
      `
    }
  }

  async shorten (longId) {
    const {
      client,
      sequenceKey,
      shortToLongKey,
      longToShortKey
    } = this._opts

    return client.eval(
      this._command,
      sequenceKey,
      shortToLongKey,
      longToShortKey,
      longId
    )
  }

  async expand (shortId) {
    const {
      client,
      shortToLongKey
    } = this._opts

    return client.hget(shortToLongKey, shortId)
  }
}

module.exports = StorageRedis
