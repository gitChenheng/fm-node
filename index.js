/**
 * by ch
 */
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
const https = require('https');
const enforceHttps = require('koa-sslify').default;
app.use(enforceHttps());

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


// const server = https.createServer(app.callback());
// server.listen(3000);

const options = {
  key: fs.readFileSync('./https/2_www.denominator.online.key'),
  cert: fs.readFileSync('./https/1_www.denominator.online_bundle.crt')
};
const httpsServer = https.createServer(options, app.callback());
httpsServer.listen(3000);



