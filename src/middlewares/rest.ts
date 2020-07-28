export default {
    APIError (code?, msg?: string) {
        this.code = code || "internal:unknown_error";
        this.msg = msg || "";
    },
    restIfy: (pathPrefix?: string) => {
        pathPrefix = pathPrefix || "/api/";
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                ctx.rest = (data) => {
                    ctx.response.type = "application/json";
                    ctx.response.body = data;
                };
                try {
                    await next();
                } catch (e) {
                    ctx.response.status = 400;
                    ctx.response.type = "application/json";
                    ctx.response.body = {
                        code: e ? e.code : "internal:unknown_error",
                        msg: e ? e.message : ""
                    };
                }
            } else {
                await next();
            }
        };
    }
};
