const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  socket: { 
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_KEY,
});

redisClient.connect((err) => {
  if (err) {
    console.error('Error connecting to Redis:', err);
  } else {
    console.log('Connected to Redis server');
  }
});

redisClient.select(1, (err) => {
  if (err) {
    console.error('Error selecting Redis database:', err);
  } else {
    // Other Redis operations here
  }
});

async function checkDailyAskLimit(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `user:${userId}:${today}`;

  const counter = await redisClient.get(key);

  if (counter && parseInt(counter, 10) >= 5) {
    console.log('User has exceeded the daily ask limit.');
    return false;
  }

  return true;
}

async function incrementDailyAskCount(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `user:${userId}:${today}`;

  // Increment the count
  await redisClient.incr(key);

  // Optionally, set expiration for the key (e.g., expire after one day)
  await redisClient.expire(key, 24 * 60 * 60);
}

async function getDailyAskCount(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `user:${userId}:${today}`;

  const counter = await redisClient.get(key);

  return parseInt(counter, 10) || 0;
}

module.exports = { redisClient, checkDailyAskLimit, incrementDailyAskCount, getDailyAskCount };
