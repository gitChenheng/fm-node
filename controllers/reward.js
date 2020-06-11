const model=require('../model');
const rangeRewardArray=[1,2,3];//积分排名
let addReward=async (ctx,next)=>{
    let body=ctx.request.body;
    let Reward=model.Reward;
    if(!body.name){
        ctx.rest(JSONResult.err('缺少奖品名'));
        return;
    }
    if(!body.type){
        ctx.rest(JSONResult.err('缺少奖品类别'));
        return;
    }else{
        if(rangeRewardArray.includes(body.type)){
            const ifExt=await Reward.findOne({
                where:{isDeleted:false,type:body.type}
            });
            if(ifExt){
                ctx.rest(JSONResult.err('已存在该类别奖品'));
                return ;
            }
        }else{
            if(!body.needCredit){
                ctx.rest(JSONResult.err('奖品类别为可兑换，缺少兑换所需积分'));
                return ;
            }
        }
    }
    if(body.needCredit&&typeof body.needCredit!='number'){
        ctx.rest(JSONResult.err('所需积分类型错误'));
        return ;
    }
    let temp_reward=await Reward.findOne({
        where:{isDeleted:false,name:body.name}
    });
    if(temp_reward){
        ctx.rest(JSONResult.err('该名称已存在'));
        return;
    }
    try {
        let reward=await Reward.create(body);
        if(reward)
            ctx.rest(JSONResult.ok(null,'添加成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateReward=async (ctx,next)=>{
    let body=ctx.request.body;
    let Reward=model.Reward;
    try {
        let reward=await Reward.update(
            body,
            {where:{isDeleted:false,id:body.id}}
        );
        if(reward)
            ctx.rest(JSONResult.ok(reward));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delReward=async (ctx,next)=>{
    let body=ctx.request.body;
    let Reward=model.Reward;
    try {
        let reward=await Reward.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(reward)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findReward=async (ctx,next)=>{
    let Reward=model.Reward;
    let reward=await Reward.findAll({
        where:{isDeleted:false,onShelf:true}
    });
    ctx.rest(JSONResult.ok(reward));
};

module.exports = {
    'POST /api/admin/addReward': addReward,
    'POST /api/admin/updateReward': updateReward,
    'POST /api/admin/delReward': delReward,
    'POST /api/findReward': findReward,
};
