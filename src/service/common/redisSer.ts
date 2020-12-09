import RedisSingleton from "@/server/redis";

export const setRedisData = async (token, userInfo) => {
    await RedisSingleton.getRedisInstance().set(token, JSON.stringify(userInfo));
    await RedisSingleton.getRedisInstance().expire(token, 30 * 24 * 60 * 60);
}

export const getRedisData = async (key) => {
    return await RedisSingleton.getRedisInstance().get(key);
}
