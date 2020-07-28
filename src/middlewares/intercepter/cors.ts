export default () => {
    return async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
        ctx.set("Access-Control-Allow-Headers", "Content-Type,Authorization,Accept,token");
        // ctx.set("X-XSS-Protection", "1; mode=block");
        // ctx.set("Content-Security-Policy", "default-src \'self\' code.jquery.com;form-action \'self\'");
        // ctx.set("X-FRAME-OPTIONS", "DENY");
        if (ctx.method === "OPTIONS"){
            ctx.set("Access-Control-Max-Age", 3600 * 24);
            ctx.body = ""
        }
        await next();
    }
};
