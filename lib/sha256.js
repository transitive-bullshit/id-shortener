'use strict'

const crypto = require('crypto')
const uuid = require('uuid')

module.exports = function sha256 (str) {
  const buffer = Buffer.from(str ? str.toString() : uuid.v4())
  return crypto.createHash('sha256').update(buffer).digest('hex')
}
