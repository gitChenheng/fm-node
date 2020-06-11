const model=require('../model');
const admin=require('../services/admin');
const util=require('../utils/util');
const {get_access_token,msg_sec_check}=require('../services/wx.js');
const {toast}=require('../constans');

let addMessageBoard=async (ctx,next)=>{
    let body=ctx.request.body;
    let MessageBoard=model.MessageBoard;
    try {
        const uid=await admin.getUid(ctx,next);
        const User=model.User;
        const user=await User.findOne({
            where:{isDeleted:false,id:uid}
        });
        const createdUid=uid;
        const createdName=user.name;
        const avatarUrl=user.avatarUrl;
        const at=await get_access_token();
        if(at.errcode){
            ctx.rest(JSONResult.err(at.errmsg))
        }else{
            let msc=await msg_sec_check(at.access_token,body.content);
            if(msc.errcode===87014){
                ctx.rest(JSONResult.err(toast.RISKY_HINT))
            }else if(msc.errcode){
                ctx.rest(JSONResult.err(msc.errmsg))
            }else{
                await MessageBoard.create({createdUid,createdName,avatarUrl,...body});
                ctx.rest(JSONResult.ok(null,'发送成功'));
            }
        }
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateMessageBoard=async (ctx,next)=>{
    let body=ctx.request.body;
    let MessageBoard=model.MessageBoard;
    try {
        let messageBoard=await MessageBoard.update(
            {content:body.content},
            {
                where:{id:body.id}
            }
        );
        if(messageBoard)
            ctx.rest(JSONResult.ok(messageBoard,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delMessageBoard=async (ctx,next)=>{
    let body=ctx.request.body;
    let MessageBoard=model.MessageBoard;
    try {
        let messageBoard=await MessageBoard.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(messageBoard)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findMessageBoard=async (ctx,next)=>{
    let body=ctx.request.body;
    let MessageBoard=model.MessageBoard;
    let messageBoard=await MessageBoard.findAll({
        where:{isDeleted:false,infoId:body.infoId}
    });
    let vo=JSON.parse(JSON.stringify(messageBoard));
    vo.forEach(it=>{
        it.createdName=util.uncodeUtf16(it.createdName);
        it.createdAt=util.decodeDate(it.createdAt,true);
    });
    ctx.rest(JSONResult.ok(vo));
};

module.exports = {
    'POST /api/addMessageBoard': addMessageBoard,
    'POST /api/updateMessageBoard': updateMessageBoard,
    'POST /api/delMessageBoard': delMessageBoard,
    'POST /api/findMessageBoard': findMessageBoard,
};
