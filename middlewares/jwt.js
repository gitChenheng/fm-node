const jwt=require('jsonwebtoken');
const JSONResult=require('./JSONResult');
const redis=require('../redis/redis');
const {JWT_SECRET}=require('../constans');
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
        return jwt.sign(obj,JWT_SECRET,{expiresIn:'30d'});//1h  1d
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
                    await jwt.verify(token,JWT_SECRET,null,async (err, decoded)=>{//此处解密为异步
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
