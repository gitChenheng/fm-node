import {getRedisIns} from "@/server/redis";

export const setRedisData = async (token, userInfo) => {
    await getRedisIns().set(token, JSON.stringify(userInfo));
    await getRedisIns().expire(token, 30 * 24 * 60 * 60);
}

export const getRedisData = async (key) => {
    return await getRedisIns().get(key);
}
