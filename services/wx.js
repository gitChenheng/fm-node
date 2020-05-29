const {APP_ID,APP_SECRET} = require('../constans');
const koaRequest = require('koa2-request');

module.exports={
    js_code2_session:async (js_code)=>{
        const jscode2session=await koaRequest({
            url: `https://api.weixin.qq.com/sns/jscode2session`,
            method: 'GET',
            qs: {
                appid:APP_ID,
                secret:APP_SECRET,
                js_code,
                grant_type:'authorization_code',
            }
        });
        return jscode2session.body;
    },
    get_access_token:async ()=>{
        const at=await koaRequest({
            url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`,
            method: 'GET',
        });
        return at.body;
        // return {
        //     "access_token": "33_rqZlSn5lm1NHgzlNRA3zblm0OIplhVGqEqTiC-SYJpg_ktOUOF5EhoGnQgctpbbRt5VJ5HkkX2OKmRBPCq9vD07BW4sL5p5ve8ddjX4Oo9ySY9F-0mIsiWPvFWLK4F9ML4m4mhudaQNi0nJSARGfAJAMDS",
        //     "expires_in":7200
        // }
    },
    msg_sec_check:async (access_token,content)=>{
        const msg_sec_res=await koaRequest({
            url: `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${access_token}`,
            method: 'POST',
            body:JSON.stringify({content})
        });
        return msg_sec_res.body;
    },
    img_sec_check:async (access_token,content)=>{
        const img_sec_check=await koaRequest({
            url: `https://api.weixin.qq.com/wxa/img_sec_check?access_token=${access_token}`,
            method: 'POST',
        });
        return img_sec_check.body;
    },
}
