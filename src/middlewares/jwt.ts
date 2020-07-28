import jwt from "jsonwebtoken";
import JSONResult from "../utils/JSONResult";
import {getRedisIns} from "@/server/redis";
import {JWT_SECRET} from "@/constans/global";
import whiteList from "@/constans/whiteList";

export const sign = (obj) => {
    return jwt.sign(obj, JWT_SECRET, {expiresIn: "30d"}); //1h  1d
}

export const urlJudge = (request_url) => {
    if (whiteList.includes(request_url)){
        return true;
    }
    for (const o of request_url){
        if (request_url.startsWith(o)){
            return true;
        }
    }
    return false;
}

export const verify = () => {
    return async (ctx, next) => {
        const request_url = ctx.request.url;
        if (urlJudge(request_url)){
            await next();
        }else{
            const token = ctx.request.header.token;
            const redisResult = await getRedisIns().get(token);
            if (redisResult){
                await next()
            }else{
                await jwt.verify(token, JWT_SECRET, null, async (err, decoded) => {//此处解密为异步
                    if (err){
                        ctx.response.body = JSONResult.authority()
                    }else{
                        await next()
                    }
                });
            }
        }
    }
}
