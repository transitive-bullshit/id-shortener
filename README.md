# id-shortener

> Efficient id / url shortener backed by pluggable storage defaulting to redis.

[![NPM](https://img.shields.io/npm/v/id-shortener.svg)](https://www.npmjs.com/package/id-shortener) [![Build Status](https://travis-ci.com/transitive-bullshit/id-shortener.svg?branch=master)](https://travis-ci.com/transitive-bullshit/id-shortener) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- Efficient, minimal short ID generation and long ID retrieval
- Pluggable storage backend defaulting to redis
  - Supports [node_redis](https://github.com/NodeRedis/node_redis) and [ioredis](https://github.com/luin/ioredis) interchangeably
- Customizable short ID character set
  - Defaults to [base 60](http://ttk.me/w/NewBase60) to maximize URL compatibility
- Customizable idempotency
  - Eg, if you shorten the same ID multiple times, you may always return the same short ID (default `idempotent: true`) or always returning unique IDs (`idempotent: false`)
- Thorough unit tests running against an actual instance of redis via [docker-compose](https://docs.docker.com/compose/)

## Install

```bash
npm install --save id-shortener
```

## Usage

```js
const IdShortener = require('id-shortener')

// create a redis client as the backend
const Redis = require('ioredis')
const redisClient = new Redis('redis://localhost:6379')

const shortener = new IdShortener({
  client: redisClient
})

const shortId = await shortener.shorten('test-key') => very short base60 string
const longId = await shortener.expand(shortId) // => 'test-key'
```

## API

### class IdShortener(opts)

- `opts.client` - object, *required* client to use for storage backend
  - currently supports instances of [node_redis](https://github.com/NodeRedis/node_redis) and [ioredis](https://github.com/luin/ioredis)
- `opts.characters` - string, optional character set to use for short IDs (default [base 60](http://ttk.me/w/NewBase60))
- `opts.idempotent` - boolean, optional whether or not `shorten` should be idempotent (default `true`)

_redis-specific_
- `opts.shortToLongKey` - string, optional key to use for short to long mapping (default `'id-shortener:short-to-long'`)
- `opts.longToShortKey` - string, optional key to use for long to short mapping (default `'id-shortener:long-to-short'`)
  - _Note_ this key is only used if `idempotent` is `true`
- `opts.sequenceKey` - string, optional key to use for atomic id counter (default `'id-shortener:sequence'`)

#### shorten

Returns a shortened version of the given long ID. _Note_ this method's semantics are highly affected by the `idempotent` option that was passed to the `IdShortener` constructor.

`IdShortener.shorten(string longId) => Promise<string shortId>`

#### expand

Returns the long version of the given short ID. _Note_ that this method will return `undefined` if the `shortId` is not found.

`IdShortener.expand(string shortId) => Promise<string longId>`

## License

MIT © [Travis Fischer](https://github.com/fisch0920)

## Why??? 💩

Building a URL shortener is a [very](https://stackoverflow.com/questions/742013/how-to-code-a-url-shortener), [very](http://n00tc0d3r.blogspot.com) [common](https://www.hiredintech.com/classrooms/system-design/lesson/55) [interview](https://www.interviewbit.com/problems/tiny-url/) [question](https://www.educative.io/collection/page/5668639101419520/5649050225344512/5668600916475904) with lots of [great](https://github.com/Hedronium/url-shorty) [existing](https://gist.github.com/bhelx/778542) [example](https://github.com/delight-im/ShortURL) [solutions](https://gist.github.com/epeli/1158171).

That being said, I couldn't find an up-to-date, open source, NodeJS module that fit my project's needs.

With this in mind, the goal of this module is not to be a perfect URL shortening solution ([xkcd](https://xkcd.com/927/)), as every use case will inevitably have unique differences, but rather to provide a solid example implementation for other Node devs. ✌️

![](http://i.giphy.com/3o6Zt4rDm1bx6iLHYA.gif)
