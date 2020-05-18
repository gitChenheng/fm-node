const model=require('../model');
const admin=require('../services/admin');
const common=require('./common');

let addPlatform=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Platform=model.Platform;
            if(!body.name){
                ctx.rest(JSONResult.err('缺少平台名'));
                return;
            }
            let temp_platform=await Platform.findOne({
                where:{name:body.name,isDeleted:0}
            });
            if(temp_platform){
                ctx.rest(JSONResult.err('该名称已存在'));
                return;
            }
            let platform=await Platform.create(body);
            if(platform)
                ctx.rest(JSONResult.ok());
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let updatePlatform=async (ctx,next)=>{
    let body=ctx.request.body;
    let Platform=model.Platform;
    try {
        let platform=await Platform.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(platform)
            ctx.rest(JSONResult.ok(platform,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delPlatform=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Platform=model.Platform;
            let platform=await Platform.update(
                {isDeleted:true},
                {where:{id:body.id}}
            );
            if(platform)
                ctx.rest(JSONResult.ok(null,'删除成功'));
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

let findPlatform=async (ctx,next)=>{
    let Platform=model.Platform;
    let platform=await Platform.findAll({
        where:{isDeleted:false}
    });
    ctx.rest(JSONResult.ok(platform));
};

let uploadPlatformImg=async (ctx,next)=>{
    try {
        let role=await admin.getRole(ctx,next);
        if(role){
            let body=ctx.request.body;
            let Platform=model.Platform;
            let temp_platform=await Platform.findOne({
                where:{id:body.platformId,isDeleted:false}
            });
            if(temp_platform){
                let filePath=await common.uploadFile(ctx,next);
                let platform=await Platform.update(
                    {platformImgUrl:filePath},
                    {where:{id:body.platformId,isDeleted:false}}
                );
                if(platform)
                    ctx.rest(JSONResult.ok());
            }else{
                ctx.rest(JSONResult.ok('平台id错误'));
            }
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e) {
        throw APIError(e);
    }
};

module.exports = {
    'POST /api/admin/addPlatform': addPlatform,
    'POST /api/admin/updatePlatform': updatePlatform,
    'POST /api/admin/delPlatform': delPlatform,
    'POST /api/admin/findPlatform': findPlatform,
    'POST /api/admin/uploadPlatformImg': uploadPlatformImg,
};
