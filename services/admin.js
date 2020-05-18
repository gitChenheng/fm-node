const redis=require('../redis/redis');
const model=require('../model');

const jwt=require('jsonwebtoken');
const JSONResult=require('../utils/JSONResult');
const jwt_secret='1eaf3h45467gvf_sf23';

module.exports={
    getUid:async function(ctx,next){
        let token=ctx.request.header['token'];
        let redisResult=await redis.get(token);
        if(redisResult){
            return JSON.parse(redisResult).uid
        }else{
            return await jwt.verify(token,jwt_secret,null,async (err, decoded)=>{//此处解密为异步
                if(err){
                    ctx.response.body=JSONResult.authority()
                }else{
                    return decoded.uid
                }
            });
        }
    },
    getRole:async function(ctx,next){
        let uid=await this.getUid(ctx,next);
        let User=model.User;
        let user=await User.findById(uid);
        return user.role
    }
};
