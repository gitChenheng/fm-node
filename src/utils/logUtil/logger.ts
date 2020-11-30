import {Context} from "koa";
import {info} from "./log4";

export function httpLogger() {
    return async (ctx: Context, next: () => Promise<void>) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
    }
}
