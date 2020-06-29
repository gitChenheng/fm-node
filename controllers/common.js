const fs=require('fs');
const path=require('path');
const util=require('../utils/util');
const jwt=require('../middlewares/jwt');
const redis=require('../redis/redis');
const model=require('../model');
const Sequelize = require('sequelize');
const {js_code2_session} =require('../services/wx');

const uploadFile=async (ctx,next)=>{
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

const login=async (ctx,next)=>{
    let body=ctx.request.body;
    try {
        if(!body.code){
            ctx.rest(JSONResult.err('缺省code'));
            return;
        }
        const jscode2session=await js_code2_session(body.code);
        if(jscode2session.errcode){
            ctx.rest(JSONResult.err(jscode2session.errmsg))
        }else{
            let User=model.User;
            let prs={
                openid:JSON.parse(jscode2session).openid,
                ...body,
                name:util.utf16toEntities(body.nickName),
                // address:'',
                credit:0,
                balance:0,
                role:0,
            };
            delete body.code;
            delete body.nickName;
            let user=await User.findOne({
                where:{isDeleted:false,openid:JSON.parse(jscode2session).openid},
            })
            if(!user){
                if(body.shareId){
                    prs.shareid=body.shareId;
                    user=await User.create(prs);
                    await User.update(
                        {credit:Sequelize.literal('`credit`+100')},
                        {where:{isDeleted:false,id:body.shareId}},
                    );
                }else{
                    user=await User.create(prs);
                }
            }
            let userInfo={
                uid:user.id,
                timestamp:Date.now(),
            };
            const token=jwt.sign(userInfo);
            await redis.set(token,JSON.stringify(userInfo));
            await redis.expire(token,30*24*60*60);
            await ctx.rest(JSONResult.ok({token:token},'登录成功'))
            // let user=await User.findOrCreate({
            //     where:{isDeleted:false,openid:JSON.parse(jscode2session).openid},
            //     defaults:prs
            // });
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

const getAllListOfAward=async (ctx,next)=>{
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
        let Achieve=model.Achieve;
        let achieve=await Achieve.findAll({
            where:{isDeleted:false}
        });
        let Reward=model.Reward;
        let reward=await Reward.findAll({
            where:{isDeleted:false}
        });
        ctx.rest(JSONResult.ok({
            typeData:type,
            platformData:platform,
            methodData:method,
            achieveData:achieve,
            rewardData:reward,
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

const getAddressList=async (ctx,next)=>{
    const addressJSONFile=fs.readFileSync(`${process.cwd()}/utils/address.json`).toString();
    const adrObjArr=JSON.parse(addressJSONFile);
    ctx.rest(JSONResult.ok(adrObjArr))

};

module.exports = {
  uploadFile,
    'POST /api/uploadFile': uploadFile,
    'POST /api/login': login,
    'POST /api/admin/getAllListOfAward': getAllListOfAward,
    'POST /api/getAddressList': getAddressList,
};
