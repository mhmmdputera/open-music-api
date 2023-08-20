/* eslint-disable linebreak-style */
const redis = require('redis');

// eslint-disable-next-line require-jsdoc
class CacheService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  // eslint-disable-next-line require-jsdoc
  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  // eslint-disable-next-line require-jsdoc
  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  // eslint-disable-next-line require-jsdoc
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
