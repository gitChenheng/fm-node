const fs=require('fs');
const path=require('path');
const util=require('../utils/util');
const jwt=require('../middlewares/jwt');
const redis=require('../redis/redis');
const model=require('../model');
const koaRequest = require('koa2-request');
const admin=require('../services/admin');
const db = require('../db');

let uploadFile=async (ctx,next)=>{
    const fileName=ctx.request.body.name||util.generateId(6,16);
    const file = ctx.request.files.file;
    if(file.size>1000000){
        ctx.rest(JSONResult.err('上传文件过大，请不要超过1M'));
        return;
    };
    // 创建可读流
    const render = fs.createReadStream(file.path);
    let filePath = path.join(process.cwd(), 'public/uploads/',fileName+'.'+file.name.split('.').pop());
    const fileDir = path.join(process.cwd(), 'public/uploads/');
    try {
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, err => {
                console.log(err);
                console.log('创建失败')
            });
        }
        // 创建写入流
        const upStream = fs.createWriteStream(filePath);
        render.pipe(upStream);
        return `/uploads/${fileName+'.'+file.name.split('.').pop()}`;
    }catch (e) {
        throw new APIError('',e)
    }
    /**
    const files = ctx.request.files.file;
    for (let file of files) {
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        // 获取上传文件扩展名
        let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    }
     **/
};

let test_cors=async (ctx,next)=>{
    // const body=ctx.request.body;
    let token=ctx.request.header['token'];
    let redisResult=await redis.get(token);
    // console.log(JSON.parse(redisResult).uid);



    ctx.rest(JSONResult.ok())
};

let login=async (ctx,next)=>{
    let body=ctx.request.body;
    try {
        if(!body.code){
            ctx.rest(JSONResult.err('缺省code'));
            return;
        }
        let res=await koaRequest({
            url: `https://api.weixin.qq.com/sns/jscode2session`,
            method: 'GET',
            qs: {
                appid: 'wx43c3b5e1b112b5b0',
                secret: '054863f7132604d2c147d57b6b3158ae',
                js_code:body.code,
                grant_type:'authorization_code',
            }
        });
        if(res.body){
            let User=model.User;
            let prs={
                openid:JSON.parse(res.body).openid,
                ...body,
                name:util.utf16toEntities(body.nickName),
                // address:'',
                credit:0,
                balance:0,
                role:0,
            };
            delete body.code;
            delete body.nickName;
            let user=await User.findOrCreate({
                where:{isDeleted:false,openid:JSON.parse(res.body).openid},
                defaults:prs
            });
            if(user){
                let userInfo={
                    uid:user[0].id,
                    timestamp:Date.now(),
                };
                const token=jwt.sign(userInfo);
                await redis.set(token,JSON.stringify(userInfo));
                await redis.expire(token,30*24*60*60);
                await ctx.rest(JSONResult.ok({token:token},'登录成功'))
            }
        }else{
            ctx.rest(JSONResult.err('js_code2session failed'))
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

let getAllListOfAward=async (ctx,next)=>{
    try {
        let Type=model.Type;
        let type=await Type.findAll({
            where:{isDeleted:false}
        });
        let Platform=model.Platform;
        let platform=await Platform.findAll({
            where:{isDeleted:false}
        });
        let Method=model.Method;
        let method=await Method.findAll({
            where:{isDeleted:false}
        });
        ctx.rest(JSONResult.ok({
            typeData:type,
            platformData:platform,
            methodData:method,
        }))

        // let role=await admin.getRole(ctx,next);
        // if(role){
        //
        // }else{
        //     ctx.rest(JSONResult.err('无权限'))
        // }
    }catch (e) {
        throw APIError(e)
    }

};

module.exports = {
  uploadFile,
    'POST /api/uploadFile': uploadFile,
    'POST /api/test_cors': test_cors,
    'POST /api/login': login,
    'POST /api/admin/getAllListOfAward': getAllListOfAward,
};
