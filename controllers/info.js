const model=require('../model');
const admin=require('../services/admin');
const util=require('../utils/util');
const Sequelize = require('sequelize');

let addInfo=async (ctx,next)=>{
    let body=ctx.request.body;
    let authorId=await admin.getUid(ctx,next);
    let Info=model.Info;
    if(typeof Number(body.price)!=='number'){
        ctx.rest(JSONResult.err('price类型错误'));
        return;
    }
    try {
        let vo=JSON.parse(JSON.stringify(body));
        vo.startTime=new Date(vo.startTime);
        vo.endTime=new Date(vo.endTime);
        vo.reviewStatus=0;
        vo.authorId=authorId;
        let User=model.User;
        let user=await User.findOne({
            where:{isDeleted:false,id:authorId}
        });
        vo.author=user.name;
        // console.log('name===',util.uncodeUtf16(user.name))

        let Platform=model.Platform;
        let platform=await Platform.findOne({
            where:{isDeleted:false,id:vo.platformId}
        });
        vo.platformImgUrl=platform.platformImgUrl;
        vo.platform=platform.name;
        let Type=model.Type;
        let type=await Type.findOne({
            where:{isDeleted:false,id:vo.typeId}
        });
        vo.type=type.name;

        let info=await Info.create(vo);
        if(info)
            ctx.rest(JSONResult.ok());
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateInfo=async (ctx,next)=>{
    let body=ctx.request.body;
    let Info=model.Info;
    try {
        let info=await Info.update(
            {name:body.name},
            {
                where:{id:body.id}
            }
        );
        if(info)
            ctx.rest(JSONResult.ok(info,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delInfo=async (ctx,next)=>{
    let body=ctx.request.body;
    let Info=model.Info;
    try {
        let info=await Info.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(info)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findInfoService=async (ctx,next,reviewStatus,uid)=>{
    let Info=model.Info,info;
    let body=ctx.request.body;
    let query;
    if(reviewStatus=='all'){
        query={
            where:{isDeleted:false,authorId:uid},
            order:[
                ['createdAt','DESC']
            ],
        }
    }else{
        query={
            where:{isDeleted:false,reviewStatus},
            order:reviewStatus==1?[
                ['createdAt','DESC']
            ]:[],

        }
    }
    let offset;
    if(body.pageIndex&&body.pageSize){
        offset=(Number(body.pageIndex)-1)*Number(body.pageSize);
        query={...query,offset, limit:body.pageSize}
    }
    info=await Info.findAll(query);
    let vo=JSON.parse(JSON.stringify(info));
    let now=Date.now();
    vo.forEach(it=>{
        it.ifBegin=new Date(it.startTime).getTime()<now;
        it.ifEnd=new Date(it.endTime).getTime()<now;
        it.author=util.uncodeUtf16(it.author);
        it.createdAt=util.decodeDate(it.createdAt);
        it.startTime=util.decodeDate(it.startTime);
        it.endTime=util.decodeDate(it.endTime);
    });
    ctx.rest(JSONResult.ok(vo));
};
let findInfo=async (ctx,next)=>{
    let body=ctx.request.body;
    if(body.type=='needToApproveInfo'){
        let role=await admin.getRole(ctx,next);
        if(role){
            await findInfoService(ctx,next,0)
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }else if(body.type=='myInfo'){
        let uid=await admin.getUid(ctx,next);
        if(uid)
            await findInfoService(ctx,next,'all',uid);
    }else if(body.type=='single'){
        let Info=model.Info;
        let info=await Info.findOne({
            where:{isDeleted:false,reviewStatus:1,id:body.id},
        });
        let vo=JSON.parse(JSON.stringify(info));
        let now=Date.now();
        vo.ifBegin=new Date(vo.startTime).getTime()<now;
        vo.ifEnd=new Date(vo.endTime).getTime()<now;
        vo.author=util.uncodeUtf16(vo.author);
        vo.createdAt=util.decodeDate(vo.createdAt);
        vo.startTime=util.decodeDate(vo.startTime);
        vo.endTime=util.decodeDate(vo.endTime);
        ctx.rest(JSONResult.ok(vo));
    }else{
        await findInfoService(ctx,next,1)
    }
};

let approve=async (ctx,next)=>{
    let body=ctx.request.body;
    try{
        let role=await admin.getRole(ctx,next);
        if(role){
            if(body.type){//通过
                let Info=model.Info;
                let info_s=await Info.findOne({
                    where:{isDeleted:false,id:body.id}
                });
                let level=body.levelId;
                let credit=Number(level)*10;
                let info_u=await Info.update(
                    {reviewStatus:1,credit,level},
                    {
                        where:{isDeleted:false,id:body.id}
                    }
                );
                let User=model.User;
                let user_u=await User.update(
                    {credit:Sequelize.literal('`credit`+'+credit)},
                    {where:{id:info_s.authorId}}
                );
                if(info_u&&user_u)
                    ctx.rest(JSONResult.ok('审批成功'));
            }else{//驳回
                let Info=model.Info;
                let info=await Info.update(
                    {reviewStatus:2,rejectReason:body.reason},
                    {
                        where:{id:body.id}
                    }
                );
                if(info)
                    ctx.rest(JSONResult.ok('驳回成功'));
            }
        }else{
            ctx.rest(JSONResult.err('无权限'))
        }
    }catch (e){
        throw new APIError('',e)
    }
};

let findInfoConditional=async (ctx,next)=>{
    let body=ctx.request.body;
    let Info=model.Info;
    let criteria={
        isDeleted:false,reviewStatus:1,//审核状态 0默认 1通过 2驳回
    };
    if(body.search){
        criteria['name']={
            $like:`%${body.search}%`
        }
    }
    if(body.typeId){
        criteria['typeId']=body.typeId
    }
    if(body.platformId){
        criteria['platformId']=body.platformId
    }
    let query={
        where:criteria,
        order:[
            ['createdAt','DESC']
        ],
    };
    let offset;
    if(body.pageIndex&&body.pageIndex){
        offset=(Number(body.pageIndex)-1)*Number(body.pageSize);
        query={...query,offset, limit:body.pageSize}
    }
    let info=await Info.findAll(query);
    let vo=JSON.parse(JSON.stringify(info));
    let now=Date.now();
    vo.forEach(it=>{
        it.ifBegin=new Date(it.startTime).getTime()<now;
        it.ifEnd=new Date(it.endTime).getTime()<now;
        it.author=util.uncodeUtf16(it.author);
        it.createdAt=util.decodeDate(it.createdAt);
        it.startTime=util.decodeDate(it.startTime);
        it.endTime=util.decodeDate(it.endTime);
    });
    ctx.rest(JSONResult.ok(vo));
};

module.exports = {
    'POST /api/addInfo': addInfo,
    'POST /api/updateInfo': updateInfo,
    'POST /api/delInfo': delInfo,
    'POST /api/findInfo': findInfo,
    'POST /api/findInfoConditional': findInfoConditional,
    'POST /api/admin/approve': approve,
};
