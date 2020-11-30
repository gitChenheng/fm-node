import {APP_ID, APP_SECRET, ACCESS_TOKEN} from "@/constans/global";
import koaRequest from "koa2-request";
import {get, set, show_cache} from "@/utils/cache";

export const js_code2_session = async (js_code) => {
    const jscode2session = await koaRequest({
        url: `https://api.weixin.qq.com/sns/jscode2session`,
        method: "GET",
        qs: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code,
            grant_type: "authorization_code",
        }
    });
    return jscode2session.body;
}

export const at_server = async () => {
    const at = await koaRequest({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`,
        method: "GET",
    });
    return JSON.parse(at.body);
}

export const get_access_token = async () => {
    const cache_access_token = get(ACCESS_TOKEN);
    if (cache_access_token){
        return JSON.parse(cache_access_token);
    }else{
        const at = await at_server();
        set(ACCESS_TOKEN, JSON.stringify(at), 1200);
        return at;
    }
}

export const msg_sec_check = async (access_token, content) => {
    const msg_sec_res = await koaRequest({
        url: `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${access_token}`,
        method: "POST",
        body: JSON.stringify({content})
    });
    return JSON.parse(msg_sec_res.body);
}

export const img_sec_check = async (access_token, content) => {
    const res = await koaRequest({
        url: `https://api.weixin.qq.com/wxa/img_sec_check?access_token=${access_token}`,
        method: "POST",
    });
    return res.body;
}
