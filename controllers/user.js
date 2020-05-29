const model=require('../model');
const util=require('../utils/util');
const redis=require('../redis/redis');
const admin=require('../services/admin');
const Sequelize = require('sequelize');

let addUser=async (ctx,next)=>{
    let body=ctx.request.body;
    let User=model.User;
    if(!body.phone){
        ctx.rest(JSONResult.err('请输入手机号'));
        return;
    }
    if(!util.checkPhone(body.phone)){
        ctx.rest(JSONResult.err('手机号码格式错误'));
        return;
    }
    let temp_user=await User.findOne({
        where:{phone:body.phone}
    });
    if(temp_user){
        ctx.rest(JSONResult.err('号码已注册'));
        return;
    }
    try {
        let user=await User.create(body);
        if(user)
            ctx.rest(JSONResult.ok());
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateUser=async (ctx,next)=>{
    let body=ctx.request.body;
    let User=model.User;
    if(!body.phone){
        ctx.rest(JSONResult.err('请输入手机号'));
        return;
    }
    if(!util.checkPhone(body.phone)){
        ctx.rest(JSONResult.err('手机号码格式错误'));
        return;
    }
    try {
        let user=await User.update(
            {name:body.name},
            {where:{phone:body.phone}}
        );
        if(user)
            ctx.rest(JSONResult.ok(user,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateCredit=async (ctx,next)=>{
    let body=ctx.request.body;
    let User=model.User;
    try {
        let uid=await admin.getUid(ctx,next);
        let user=await User.findOne({
            where:{id:uid, isDeleted:false,}
        });
        if(!body.credit){
            ctx.rest(JSONResult.err('缺少credit参数'));
            return ;
        }
        if(user){
            const c=body.credit;
            let credit='';
            if(c>=0){
                credit=`+${String(c)}`;
            }else{
                credit=String(c);
            }
            await User.update(
                {credit:Sequelize.literal('`credit`'+credit)},
                {where:{isDeleted:false,id:uid}},
            )
            let res=await User.findOne({
                where:{id:uid, isDeleted:false,}
            });
            ctx.rest(JSONResult.ok(res,''));
        }

    }catch (e) {
        throw new APIError('',e)
    }
};

let delUser=async (ctx,next)=>{
    let body=ctx.request.body;
    let User=model.User;
    if(!body.phone){
        ctx.rest(JSONResult.err('请输入手机号'));
        return;
    }
    if(!util.checkPhone(body.phone)){
        ctx.rest(JSONResult.err('手机号码格式错误'));
        return;
    }
    try {
        // let user=await User.destroy({where:{phone:{eq:body.phone}}});
        let user=await User.update(
            {isDeleted:true},
            {where:{phone:body.phone}}
        );
        if(user)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findUser=async (ctx,next)=>{
    let body=ctx.request.body;
    let User=model.User;
    if(!body.name&&!body.phone){
        let user=await User.findAll({
            where:{isDeleted:false}
        });
        ctx.rest(JSONResult.ok(user));
    }else{
        if(body.phone&&!util.checkPhone(body.phone)){
            ctx.rest(JSONResult.err('手机号码格式错误'));
            return;
        }
        try {
            let user=await User.findOne({
                where:{
                    name:body.name,
                    // $or:[
                    //     {phone:{$like:body.phone}}
                    //     // {id:[1,2,3]},
                    //     // {id:{$gt:10}},
                    // ]
                }
            });
            if(user)
                ctx.rest(JSONResult.ok(user));
        }catch (e) {
            throw new APIError('',e)
        }
    }
};

let getUserInfo=async (ctx,next)=>{
    let User=model.User;
    try {
        let uid=await admin.getUid(ctx,next);
        let user=await User.findOne({
            where:{id:uid, isDeleted:false,}
        });
        if(user){
            let vo=JSON.parse(JSON.stringify(user));
            vo.name=util.uncodeUtf16(vo.name);
            let todayEarlyMorning=new Date(new Date().setHours(0, 0, 0, 0)).getTime();//今日凌晨时间戳
            if(new Date(vo.lastSignInTime).getTime()>=todayEarlyMorning){
                vo.hadSignIn=1;
            }else{
                vo.hadSignIn=0;
            }
            vo.lastSignInTime=new Date(vo.lastSignInTime).getTime();
            //delete vo.id;
            delete vo.openid;
            delete vo.createdAt;
            delete vo.updatedAt;
            delete vo.version;
            delete vo.pwd;
            ctx.rest(JSONResult.ok(vo));
        }else{
            ctx.rest(JSONResult.err('未找到用户信息！'));
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

let getRangesByCredit=async (ctx,next)=>{
    try {
        let uid=await admin.getUid(ctx,next);
        let User=model.User;
        let user=await User.findAll({
            where:{isDeleted:false},
            order:[
                ['credit','DESC']
            ],
            limit:100
        });
        if(user){
            let vo=JSON.parse(JSON.stringify(user));
            let res={
                myPosi:null,
                creditRange:[]
            };
            for (let k=0;k<vo.length;k++){
                if(vo[k].id===uid){
                    res.myPosi=k+1;
                    break;
                }
            }
            for (let k=0;k<vo.length;k++){
                const it=vo[k];
                if(k>9){
                    break;
                }
                res.creditRange.push({
                    id:it.id,
                    name:util.uncodeUtf16(it.name),
                    avatarUrl:it.avatarUrl,
                    credit:it.credit
                })
            }
            ctx.rest(JSONResult.ok(res));
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

module.exports = {
    'POST /api/addUser': addUser,
    'POST /api/updateUser': updateUser,
    'POST /api/delUser': delUser,
    'POST /api/findUser': findUser,
    'POST /api/getUserInfo': getUserInfo,
    'POST /api/getRangesByCredit': getRangesByCredit,
    'POST /api/updateCredit': updateCredit,
};
