const Redis = require('ioredis');
const redis = require('../config/config').redis;
const newRedis = new Redis(redis);
module.exports = newRedis;
