'use strict'

const IORedis = require('ioredis')

const testClient = require('./lib/test-client')

const redisUrl = 'redis://redis:6379'

const clientDescs = [
  {
    name: 'ioredis',
    client: new IORedis(redisUrl)
  }
]

clientDescs.forEach(desc => {
  testClient(desc.client, desc.name)
})
