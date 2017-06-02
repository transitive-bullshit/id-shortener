'use strict'

const Storage = require('./lib/storage')

const DEFAULT_CHARACTERS = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'

class IdShortener {
  constructor (opts) {
    const context = Object.assign({
      characters: DEFAULT_CHARACTERS,
      idempotent: true
    }, opts)

    this._storage = Storage.from(context)
  }

  async shorten (longId) {
    return this._storage.shorten(longId)
  }

  async expand (shortId) {
    return this._storage.expand(shortId)
  }
}

module.exports = IdShortener
