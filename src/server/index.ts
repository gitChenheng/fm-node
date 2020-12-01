/**
 * by ch.
 */
import "module-alias/register";
import config from "@/config/config";
import {ENV_PROD} from "@/constans/global";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import Koa from "koa";
import serve from "koa-static";
import bodyParser from "koa-bodyparser";
import koaBody from "koa-body";
import helmet from "koa-helmet";
import {cors, verify, restIfy} from "@/utils/helper/middleware";
import {createDbContext} from "@/server/db/db_context";
import {createRedisIns} from "@/server/redis";
import {httpLogger} from "@/utils/logUtil/logger";
import router, {initRouteHandle} from "@/server/routehandle";
// import enforceHttps from 'koa-sslify';
import {info} from "@/utils/log4";

// info("this is info")

const app = new Koa();

createDbContext();
createRedisIns();
app.use(helmet());
// app.use(enforceHttps()); // process.env.NODE_ENV === ENV_PROD
/**
 * maxage浏览器缓存的最大寿命（以毫秒为单位）。默认为0
 * hidden允许传输隐藏文件。默认为false
 * index 默认文件名，默认为“ index.html”
 * defer如果为true，则在服务之后return next()，允许任何下游中间件首先响应。
 * gzip 当客户端支持gzip且所请求的扩展名为.gz的文件存在时，请尝试自动提供文件的gzip压缩版本。默认为true。
 * br 当客户端支持brotli并且存在所请求的扩展名为.br的文件时，请尝试自动提供文件的brotli版本（请注意，仅通过https接受brotli）。默认为true。
 * setHeaders函数，用于在响应时设置自定义标头。
 * extensionsURL中没有扩展名时，尝试匹配传递的数组中的扩展名以搜索文件。首次发现是送达的。（默认为false）
 */
app.use(serve(path.join(process.cwd(), "/src/public/"), {maxage: 12 * 30 * 24 * 3600 * 1000}));
app.use(cors());
app.use(verify());
app.use(koaBody({multipart: true, formidable: {maxFileSize: 1000 * 1024 * 1024}})); // 10M
app.use(bodyParser());
app.use(restIfy());
initRouteHandle();
app.use(router.routes()).use(router.allowedMethods());

if (process.env.NODE_ENV === ENV_PROD){
    const options = {
        key: fs.readFileSync(`${process.cwd()}/src/server/https/2_fm_node_www.denominator.online.key`),
        cert: fs.readFileSync(`${process.cwd()}/src/server/https/1_fm_node_www.denominator.online_bundle.crt`)
    };
    const httpsServer = https.createServer(options, app.callback());
    httpsServer.listen(config.node.port, () => {
        console.log(`start at port ${config.node.port}`)
    });
} else {
    const httpServer = http.createServer(app.callback());
    httpServer.listen(config.node.port, () => {
        console.log(`start at port ${config.node.port}`)
    });
    // const io = socketIo(httpServer);
    // io.of("chat").on("connection", (socket) => {
    //     console.log('connection chat');
    //     io.to("chat").emit("enter", "welcome")
    // })
    // io.of("chat").use((socket) => {
    //     const query = socket.request._query;
    //     const token = query.token;
    //     console.log(token);
    // })
    // io.on("connection", (socket) => {// io.emit代表广播，socket.emit代表私发
    //     console.log('connection main')
    //     // console.log('req', socket.req)
    //     // console.log('query', socket.query)
    //     // io.emit("enter", `${socket.nickname} comes in`);
    //     // socket.emit("enter", `${socket.nickname} u are welcome`);
    //
    //     socket.on("message", (str) => {
    //         console.log(str)
    //         // io.emit("message", socket.nickname + ' says: ' + str)
    //     })
    //
    //     // 客户端断开，自带事件
    //     socket.on("disconnect", () => {
    //         // io.emit("leave", `${socket.nickname} left`)
    //     })
    // })
}



