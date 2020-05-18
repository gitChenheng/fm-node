const model=require('../model');
const util=require('../utils/util');
const redis=require('../redis/redis');
const Sequelize = require('sequelize');
const admin=require('../services/admin');

let addSign=async (ctx,next)=>{
    let Sign=model.Sign;
    let User=model.User;
    try {
        // let token=ctx.request.header['token'];
        // let redisResult=await redis.get(token);
        // let uid=JSON.parse(redisResult).uid;
        let uid=await admin.getUid(ctx,next);
        let user=await User.findOne({
            where:{isDeleted:false,id:uid}
        });
        if(user){
            let searchSign=await Sign.findAll({
                where:{isDeleted:false,uid,},
                order:[['createdAt','desc']]
            });
            let now=Date.now();
            if(searchSign.length){//签到过
                let todayEarlyMorning=new Date(new Date().setHours(0, 0, 0, 0)).getTime();//今日凌晨时间戳
                if(searchSign[0].createdAt<todayEarlyMorning){//最近一次签到不是今天，创建
                    //今日未签到
                    await Sign.create({uid,name:user.name});
                    await User.update(
                        {lastSignInTime:now,credit:Sequelize.literal('`credit`+1')},
                        {where:{id:uid}}
                    );
                    ctx.rest(JSONResult.ok(null,'签到成功'));
                }else{//最近一次签到是今天，更新
                    //今日已签到
                    let updateSign=await Sign.update(
                        {updatedAt:now},
                        {where:{id:searchSign[0].id}}
                    );
                    await User.update(
                        {lastSignInTime:now},
                        {where:{id:uid}}
                    );
                    if(updateSign)
                        ctx.rest(JSONResult.ok(null,'今日已签到过'))
                }
            }else{//从未签到过，创建
                //今日未签到
                await Sign.create({uid,name:user.name});
                await User.update(
                    {lastSignInTime:now,credit:Sequelize.literal('`credit`+10')},
                    {where:{id:uid}}
                );
                ctx.rest(JSONResult.ok(null,'签到成功'));
            }
        }else{
            ctx.rest(JSONResult.err('用户不存在'))
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateSign=async (ctx,next)=>{
    let body=ctx.request.body;
    let Sign=model.Sign;
    try {
        let sign=await Sign.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(sign)
            ctx.rest(JSONResult.ok(sign,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delSign=async (ctx,next)=>{
    let body=ctx.request.body;
    let Sign=model.Sign;
    try {
        let sign=await Sign.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(sign)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findSign=async (ctx,next)=>{
    let Sign=model.Sign;
    let sign=await Sign.findAll({
        where:{isDeleted:false}
    });
    ctx.rest(JSONResult.ok(sign));
};

module.exports = {
    'POST /api/addSign': addSign,
    'POST /api/updateSign': updateSign,
    'POST /api/delSign': delSign,
    'POST /api/findSign': findSign,
};
