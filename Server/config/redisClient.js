const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({ url: process.env.REDIS_URL });
const redisSubscriber = redisClient.duplicate();
const redisPublisher = redisClient.duplicate();

(async () => {
  try {
    await redisClient.connect();
    await redisSubscriber.connect();
    await redisPublisher.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Redis Connection Error:", error);
  }
})();

module.exports = { redisClient, redisSubscriber, redisPublisher };
