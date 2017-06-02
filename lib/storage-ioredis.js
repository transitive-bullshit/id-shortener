'use strict'

const StorageRedis = require('./storage-redis')

class StorageIORedis extends StorageRedis {
  constructor (opts) {
    super(opts)

    this._opts.client.defineCommand('idShortener', this._command)
  }

  async shorten (longId) {
    const {
      client,
      sequenceKey,
      shortToLongKey,
      longToShortKey
    } = this._opts

    return client.idShortener(
      sequenceKey,
      shortToLongKey,
      longToShortKey,
      longId
    )
  }
}

module.exports = StorageIORedis
