const model=require('../model');

let addMethod=async (ctx,next)=>{
    let body=ctx.request.body;
    let Method=model.Method;
    if(!body.name){
        ctx.rest(JSONResult.err('缺少方式名'));
        return;
    }
    let temp_method=await Method.findOne({
        where:{name:body.name}
    });
    if(temp_method){
        ctx.rest(JSONResult.err('该名称已存在'));
        return;
    }
    try {
        let method=await Method.create(body);
        if(method)
            ctx.rest(JSONResult.ok());
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateMethod=async (ctx,next)=>{
    let body=ctx.request.body;
    let Method=model.Method;
    try {
        let method=await Method.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(method)
            ctx.rest(JSONResult.ok(method,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delMethod=async (ctx,next)=>{
    let body=ctx.request.body;
    let Method=model.Method;
    try {
        let method=await Method.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(method)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findMethod=async (ctx,next)=>{
    let Method=model.Method;
    let method=await Method.findAll({
        where:{isDeleted:false}
    });
    ctx.rest(JSONResult.ok(method));
};

module.exports = {
    'POST /api/addMethod': addMethod,
    'POST /api/updateMethod': updateMethod,
    'POST /api/delMethod': delMethod,
    'POST /api/findMethod': findMethod,
};
