import 'reflect-metadata';
import fs from "fs";
import Router from "koa-router";
import {ClassType, RouteDefinition} from "@/decorator/Dcontroller";
import assert from "assert";

const router = new Router();

export const initRouteHandle = () => {
    const files = fs.readdirSync(`${process.cwd()}/src/controller/`);
    for (const f of files) {
        import(`${process.cwd()}/src/controller/${String(f)}`)
            .then(m => {
                const controller = m.default;
                if (controller.type && controller.type === ClassType.CTRL){
                    const instance = new controller();
                    const requestPrefix = Reflect.getMetadata('requestPrefix', controller) || '';
                    const routes: RouteDefinition[] = Reflect.getMetadata('routes', controller) || [];
                    const mds = Reflect.getMetadata('mds', controller) || [];
                    routes.forEach(route => {
                        console.log('complete request url: ', (requestPrefix + route.path))
                        router[route.requestMethod](`${requestPrefix}${route.path}`, ...mds, instance[route.methodName])
                    });
                }
            })
    }
}

export default router;
