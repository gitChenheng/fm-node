import Redis from "ioredis";
import config from "@/config/config";

let redisInstance: Redis = null;

export const createRedisIns = () => {
    redisInstance = new Redis(config.redis);
    return redisInstance;
}

export const getRedisIns = () => {
    return redisInstance;
}

// const newRedis = new Redis(config.redis);
// export default newRedis;
