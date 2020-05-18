module.exports=function () {
    return async (ctx,next)=>{
        ctx.set('Access-Control-Allow-Origin','*');
        ctx.set('Access-Control-Allow-Methods','GET,POST,OPTIONS,DELETE,PUT');
        ctx.set('Access-Control-Allow-Headers','Content-Type,Authorization,Accept,token');
        if(ctx.method === 'OPTIONS'){
            ctx.set('Access-Control-Max-Age',3600 * 24);
            ctx.body=''
        }
        await next();
    }
};
