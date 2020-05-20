const jwt=require('jsonwebtoken');
const JSONResult=require('./JSONResult');
const redis=require('../redis/redis');
const jwt_secret='1eaf3h45467gvf_sf23';
const whiteList=[
    '/api/login',
    '/api/register',
    '/api/logout',
    '/api/findInfoConditional',
    '/api/findInfo',
    '/api/admin/getAllListOfAward',
    '/api/findComment'
];

module.exports={
    sign:function (obj) {
        return jwt.sign(obj,jwt_secret,{expiresIn:'30d'});//1h  1d
    },
    verify:function () {
        return async (ctx,next)=>{
            let request_url=ctx.request.url;
            if(whiteList.includes(request_url)){
                await next();
            }else{
                let token=ctx.request.header['token'];
                let redisResult=await redis.get(token);
                if(redisResult){
                    await next()
                }else{
                    await jwt.verify(token,jwt_secret,null,async (err, decoded)=>{//此处解密为异步
                        if(err){
                            ctx.response.body=JSONResult.authority()
                        }else{
                            await next()
                        }
                    });
                }
            }
        }
    }
};
