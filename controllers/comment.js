const model=require('../model');
const admin=require('../services/admin');
const util=require('../utils/util');

let addComment=async (ctx,next)=>{
    let body=ctx.request.body;
    let Comment=model.Comment;
    try {
        let uid=await admin.getUid(ctx,next);
        let User=model.User;
        let user=await User.findOne({
            where:{isDeleted:false,id:uid}
        });
        let createdUid=uid;
        let createdName=user.name;
        let avatarUrl=user.avatarUrl;
        let comment=await Comment.create({createdUid,createdName,avatarUrl,...body});
        ctx.rest(JSONResult.ok());
    }catch (e) {
        throw new APIError('',e)
    }
};

let updateComment=async (ctx,next)=>{
    let body=ctx.request.body;
    let Comment=model.Comment;
    try {
        let comment=await Comment.update(
            {content:body.content},
            {
                where:{id:body.id}
            }
        );
        if(comment)
            ctx.rest(JSONResult.ok(comment,'修改成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let delComment=async (ctx,next)=>{
    let body=ctx.request.body;
    let Comment=model.Comment;
    try {
        let comment=await Comment.update(
            {isDeleted:true},
            {where:{id:body.id}}
        );
        if(comment)
            ctx.rest(JSONResult.ok(null,'删除成功'));
    }catch (e) {
        throw new APIError('',e)
    }
};

let findComment=async (ctx,next)=>{
    let body=ctx.request.body;
    let Comment=model.Comment;
    let comment=await Comment.findAll({
        where:{isDeleted:false,infoId:body.infoId}
    });
    let vo=JSON.parse(JSON.stringify(comment));
    vo.forEach(it=>{
        it.createdName=util.uncodeUtf16(it.createdName);
        it.createdAt=util.decodeDate(it.createdAt,true);
    });
    ctx.rest(JSONResult.ok(vo));
};

module.exports = {
    'POST /api/addComment': addComment,
    'POST /api/updateComment': updateComment,
    'POST /api/delComment': delComment,
    'POST /api/findComment': findComment,
};
