import Redis from "ioredis";
import config from "@/config/config";

export default class RedisSingleton{

    private static redisInstance: Redis = null;

    public static createRedisInstance(): void {
        this.redisInstance = new Redis(config.redis);
    }

    public static getRedisInstance(): Redis{
        if (this.redisInstance === null){
            this.createRedisInstance();
        }
        return this.redisInstance;
    }

}
