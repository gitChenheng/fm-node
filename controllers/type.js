const model=require('../model');
const admin=require('../services/admin');

let addType=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Type=model.Type;
            if(!body.name){
                ctx.rest(JSONResult.err('缺少类别名'));
                return;
            }
            let temp_type=await Type.findOne({
                where:{name:body.name,isDeleted:0}
            });
            if(temp_type){
                ctx.rest(JSONResult.err('该名称已存在'));
                return;
            }
            let type=await Type.create(body);
            if(type)
                ctx.rest(JSONResult.ok());
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let updateType=async (ctx,next)=>{
    let body=ctx.request.body;
    let Type=model.Type;
    try {
        let type=await Type.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(type)
            ctx.rest(JSONResult.ok(type,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delType=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Type=model.Type;
            let type=await Type.update(
                {isDeleted:true},
                {where:{id:body.id}}
            );
            if(type)
                ctx.rest(JSONResult.ok(null,'删除成功'));
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let findType=async (ctx,next)=>{
    let Type=model.Type;
    let type=await Type.findAll({
        where:{isDeleted:false}
    });
    ctx.rest(JSONResult.ok(type));
};

module.exports = {
    'POST /api/admin/addType': addType,
    'POST /api/admin/updateType': updateType,
    'POST /api/admin/delType': delType,
    'POST /api/admin/findType': findType,
};
