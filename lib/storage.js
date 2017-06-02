'use strict'

class Storage {
  constructor (opts) {
    this._opts = opts
  }

  /**
   * ID shortener storage factory.
   *
   * @returns {Storage}
   */
  static from (opts) {
    const { client } = opts
    if (!client) {
      throw new Error('missing required parameter "client"')
    }

    if (typeof client.defineCommand === 'function') {
      const StorageIORedis = require('./storage-ioredis')
      return new StorageIORedis(opts)
    } else if (client.eval === 'function') {
      const StorageRedis = require('./storage-redis')
      return new StorageRedis(opts)
    } else {
      throw new Error('required parameter "client" must be either a node-redis or ioredis client')
    }
  }
}

module.exports = Storage
