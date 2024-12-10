const { createClient } = require('redis');

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  
  isAlive() {
    try {
      this.client.connect()
      return true;
    } catch(err) {
      return false;
    }
  }
  
  async get(key) {
    const value = await this.client.get(key);
    return value;
  }
  
  async set(key, value, duration) {
    await this.client.set(key, value, { EX: duration });
  }

  async del(key) {
    await this.client.del(key);
  }
};

const redisClient = new RedisClient();
export default redisClient;
