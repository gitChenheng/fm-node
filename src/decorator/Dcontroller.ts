import Router from "koa-router";
import assert from "assert";
import JSONResult from "@/utils/JSONResult";
import {error} from "@/utils/log4";

type Middleware = Router.IMiddleware;

export enum ClassType {
    CTRL = 'ctrl',
}
export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    ALL = 'all',
    PUT = 'put',
    HEAD = 'head',
    PATCH = 'patch',
}
export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethod;
    methodName: string;
}
export const Controller = (target) => {
    target.type = ClassType.CTRL;
}
export const RequestPrefix = (prefix: string = ''): ClassDecorator => {
    return (target): void => {
        Reflect.defineMetadata('requestPrefix', prefix, target);
    };
};
export const RequestMapping = (
    path: string,
    method?: RequestMethod,
    middleware?: Middleware[] | Middleware
): any => {
    return (target, propertyKey: string): void => {
        /**
         * 如果装饰于类的public方法，target为类的实例化对象，target.constructor为类的构造方法
         * 如果装饰于类的static方法上，target为类的普通函数方法
         */
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        /**
         * middleware
         */
        let mds = Array.isArray(middleware) ? middleware : [middleware];
        mds = mds.filter(item => item !== undefined);
        Reflect.defineMetadata('mds', [...mds], target.constructor);

        /**
         * routes
         */
        const routes = Reflect.getMetadata('routes', target.constructor) as RouteDefinition[];
        routes.push({
            requestMethod: method || RequestMethod.GET,
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};

export function RequestParams(params){
    return (target, name, index) => {
        switch (Object.prototype.toString.call(params)) {
            case "[object Object]":
                assert(params.name, 'params 不能缺省 name 属性！');
                target.params = params;
                break;
            case "[object Array]":
                for (const o of params){
                    assert(o.name, 'params 不能缺省 name 属性！');
                }
                target.params = params;
                break;
            default:
                throw error('params type err');
        }
    };
}
// 在函数调用前执行格式化操作
export function Validate(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value =  (ctx) => {
        const params = target.params; // 预置参数
        const body = ctx.request.body; // 传入的参数
        switch (Object.prototype.toString.call(params)) {
            case "[object Object]":
                valid(params, body, ctx)
                break;
            case "[object Array]":
                for (const o of params){ //o { name: 'code', require: true, minlength: 5, maxlength: 5 }
                    valid(o, body, ctx)
                }
                break;
            default:
                throw error('params type err');
        }
        return originalMethod.call(this, ctx, body);
    };
    return descriptor;
}
function valid(o, body, ctx) {
    const paramName = o.name; //code
    const requestParamObj = body[paramName]; //body.code
    if (o.require && !requestParamObj){
        ctx.rest(JSONResult.err(`validate: lack of param '${o.name}'`))
        return ;
    }
    if (o.minlength && (String(requestParamObj).length < o.minlength)){
        ctx.rest(JSONResult.err(`validate: param '${o.name}' length can't less than the minlength`))
        return ;
    }
    if (o.maxlength && (String(requestParamObj).length > o.maxlength)){
        ctx.rest(JSONResult.err(`validate: param '${o.name}' length can't longer than the maxlength`))
        return ;
    }
}
