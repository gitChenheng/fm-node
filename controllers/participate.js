const model=require('../model');
const admin=require('../services/admin');
const util=require('../utils/util');

const actParticipate=async (ctx,next)=>{
    const body=ctx.request.body;
    const Participate=model.Participate;
    try {
        if(!body.infoId){
            ctx.rest(JSONResult.err("缺省参数infoId"));
            return ;
        }
        if(body.ifPartici===null||body.ifPartici===undefined){
            ctx.rest(JSONResult.err("缺省参数ifPartici"));
            return ;
        }
        console.log('ifPartici',body.ifPartici)
        const uId=await admin.getUid(ctx,next);
        const isExit=await Participate.findOne({
            where:{uId,infoId:body.infoId}
        });
        if(isExit){
            await Participate.update(
                {isDeleted:!body.ifPartici},
                {where:{uId,infoId:body.infoId}}
            )
        }else{
            await Participate.create({uId,infoId:body.infoId});
        }
        ctx.rest(JSONResult.ok());
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateParticipate=async (ctx,next)=>{
    let body=ctx.request.body;
    let Participate=model.Participate;
    try {
        let participate=await Participate.update(
            {content:body.content},
            {
                where:{id:body.id}
            }
        );
        if(participate)
            ctx.rest(JSONResult.ok(participate,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delParticipate=async (ctx,next)=>{
    let body=ctx.request.body;
    let Participate=model.Participate;
    try {
        let participate=await Participate.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(participate)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findParticipate=async (ctx,next)=>{
    const uId=await admin.getUid(ctx,next);
    let Participate=model.Participate;
    let participate=await Participate.findAll({
        where:{isDeleted:false,uId}
    });
    ctx.rest(JSONResult.ok(participate));
};

module.exports = {
    'POST /api/actParticipate': actParticipate,
    'POST /api/updateParticipate': updateParticipate,
    'POST /api/delParticipate': delParticipate,
    'POST /api/findParticipate': findParticipate,
};
