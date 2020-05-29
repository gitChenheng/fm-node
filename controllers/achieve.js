const model=require('../model');
const admin=require('../services/admin');

let addAch=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Achieve=model.Achieve;
            if(!body.name){
                ctx.rest(JSONResult.err('缺少成就名'));
                return;
            }
            if(!body.point){
                ctx.rest(JSONResult.err('缺少成就点数'));
                return;
            }
            if(!body.conditions){
                ctx.rest(JSONResult.err('缺少成就说明'));
                return;
            }
            let temp_Achieve=await Achieve.findOne({
                where:{name:body.name,isDeleted:0}
            });
            if(temp_Achieve){
                ctx.rest(JSONResult.err('该名称已存在'));
                return;
            }
            let achieve=await Achieve.create(body);
            if(achieve)
                ctx.rest(JSONResult.ok());
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let updateAch=async (ctx,next)=>{
    let body=ctx.request.body;
    let Achieve=model.Achieve;
    try {
        let achieve=await Achieve.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(achieve)
            ctx.rest(JSONResult.ok(type,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delAch=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Achieve=model.Achieve;
            let achieve=await Achieve.update(
                {isDeleted:true},
                {where:{id:body.id}}
            );
            if(achieve)
                ctx.rest(JSONResult.ok(null,'删除成功'));
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let findAch=async (ctx,next)=>{
    let Achieve=model.Achieve;
    let achieve=await Achieve.findAll({
        where:{isDeleted:false}
    });
    ctx.rest(JSONResult.ok(achieve));
};

module.exports = {
    'POST /api/admin/addAch': addAch,
    'POST /api/admin/updateAch': updateAch,
    'POST /api/admin/delAch': delAch,
    'POST /api/findAch': findAch,
};
