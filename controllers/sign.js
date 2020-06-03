const model=require('../model');
const util=require('../utils/util');
const redis=require('../redis/redis');
const Sequelize = require('sequelize');
const admin=require('../services/admin');
const {ACHIEVE}=require('../constans');
let addSign=async (ctx,next)=>{
    let Sign=model.Sign;
    let User=model.User;
    try {
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
                let yesterdayEarlyMorning=todayEarlyMorning-24*60*60*1000;
                const lastSignTime=searchSign[0].createdAt;
                if(lastSignTime<yesterdayEarlyMorning){//最近一次签到早于昨天
                    await Sign.create({uid,name:user.name});
                    await User.update(
                        {lastSignInTime:now,continueSign:1,credit:Sequelize.literal('`credit`+1')},
                        {where:{id:uid}}
                    );
                    ctx.rest(JSONResult.ok(null,`签到成功，积分+1`));
                }else if(lastSignTime>=yesterdayEarlyMorning&&lastSignTime<todayEarlyMorning){//昨天签到
                    await Sign.create({uid,name:user.name});
                    const largest=10;
                    let cs=user.continueSign,credit;
                    if(cs>=largest-1) {
                        credit=String(Number(largest));
                    }else{
                        credit=String(Number(cs)+1);
                    }
                    await User.update(
                        {
                            lastSignInTime:now,
                            continueSign:Sequelize.literal('`continueSign`+1'),
                            credit:Sequelize.literal('`credit`+'+credit)
                        },
                        {where:{id:uid}}
                    );
                    let achLevel=null,toastContent='';
                    switch (cs) {
                        case 7-1:
                            achLevel=ACHIEVE.SIGN_EASY;
                            toastContent=`恭喜解锁成就：${ACHIEVE.SIGN_EASY_LABEL}`
                            break;
                        case 30-1:
                            achLevel=ACHIEVE.SIGN_NORMAL;
                            toastContent=`恭喜解锁成就：${ACHIEVE.SIGN_NORMAL_LABEL}`
                            break;
                        case 90-1:
                            achLevel=ACHIEVE.SIGN_HARD;
                            toastContent=`恭喜解锁成就：${ACHIEVE.SIGN_HARD_LABEL}`
                            break;
                        case 180-1:
                            achLevel=ACHIEVE.SIGN_GOD;
                            toastContent=`恭喜解锁成就：${ACHIEVE.SIGN_GOD_LABEL}`
                            break;
                        case 365-1:
                            achLevel=ACHIEVE.SIGN_FOREVER;
                            toastContent=`恭喜解锁成就：${ACHIEVE.SIGN_FOREVER_LABEL}`
                            break;
                    }
                    if(achLevel){
                        let achieveArr;
                        if(!user.achieve){
                            achieveArr=[];
                        }else{
                            achieveArr=user.achieve.split(',');
                        }
                        if(!achieveArr.includes(achLevel)){
                            achieveArr.push(achLevel);
                            let achieve=achieveArr.join(',');
                            await User.update(
                                {achieve},
                                {where:{id:uid}}
                            );
                            ctx.rest(JSONResult.ok(null,`连续签到成功，积分+${credit}；${toastContent}`));
                        }
                    }else{
                        ctx.rest(JSONResult.ok(null,`连续签到成功，积分+${credit}`));
                    }
                }else{
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
                    {lastSignInTime:now,continueSign:1,credit:Sequelize.literal('`credit`+10')},
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
