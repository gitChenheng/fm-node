/**
 * by Chase陈
 */
const config=require('./config/config').node;
const {ENV_PROD}=require('./constans');
const fs = require('fs');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller=require('./controller');
const app = new Koa();
const path = require('path');
const cors=require('./intercepter/cors');
const jwt=require('./middlewares/jwt');
const rest=require('./middlewares/rest');
const koaBody = require('koa-body');
const staticFiles = require('koa-static');
const util=require('./utils/util');
let https;
if(process.env.NODE_ENV===ENV_PROD){
    https = require('https');
    const enforceHttps = require('koa-sslify').default;
    app.use(enforceHttps());
}
util.initAlias();
util.initGlobalEvents();
app.use(staticFiles(path.resolve(__dirname, "./public")));//静态目录
app.use(cors());
app.use(jwt.verify());
app.use(koaBody({
    multipart:true,
    formidable:{maxFileSize: 100*1024*1024}// 设置上传文件大小限制，默认1M
}));
app.use(bodyParser());
app.use(rest.restIfy());
app.use(controller());
if(process.env.NODE_ENV===ENV_PROD){
    const options = {
        key: fs.readFileSync('./https/2_www.denominator.online.key'),
        cert: fs.readFileSync('./https/1_www.denominator.online_bundle.crt')
    };
    const httpsServer = https.createServer(options, app.callback());
    httpsServer.listen(config.port,()=>{
        console.log(`start at port ${config.port}`)
    });
}else{
    app.listen(config.port,()=>{
        console.log(`start at port ${config.port}`)
    })
}



