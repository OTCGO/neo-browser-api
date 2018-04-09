const config = require('config')
const Redis = require('ioredis')
const log4js = require('log4js')
const logger = log4js.getLogger('redis')

const client = new Redis(config.redis)

client.on('error', function (err) {
  if (err) {
    logger.error('connect to redis error, check your redis config', err)
    process.exit(1)
  }
})

export   { client }
