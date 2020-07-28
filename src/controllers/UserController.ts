import {updateOrCreateUser, getUid, getUserById} from "@/services/userSer";
import {Ctrl, Api, Get, Post, View} from "@/decorators/action";
import JSONResult from "../utils/JSONResult";
import {js_code2_session} from "@/services/common/wx";
import {utf16toEntities} from "@/utils/util";

@Ctrl
export class UserController{

    @Api
    @Post
    public async login(ctx) {
        const body = ctx.request.body;
        const {code, shareid, nickName} = body;
        try {
            const jscode2session = await js_code2_session(code);
            if (jscode2session.errcode){
                ctx.rest(JSONResult.err(jscode2session.errmsg))
            }else{
                const openid = JSON.parse(jscode2session).openid;
                const userItem = {
                    openid,
                    ...body,
                    name: utf16toEntities(nickName),
                    credit: 0,
                    balance: 0,
                    role: 0,
                };
                delete userItem.code;
                delete userItem.nickName;
                const token = await updateOrCreateUser(openid, shareid, userItem);
                if (token)
                    ctx.rest(JSONResult.ok({token}, "登录成功"));
            }
        }catch (e) {
            throw e;
        }
    }

    @Api
    @Post
    public async getUserInfo(ctx) {
        try {
            const uid = await getUid(ctx);
            if (!uid){
                ctx.rest(JSONResult.authority())
            }else{
                const res = await getUserById(uid);
                if (res){
                    ctx.rest(JSONResult.ok(res))
                }else{
                    ctx.rest(JSONResult.err("未找到用户信息"))
                }
            }
        }catch (e) {
            throw e;
        }
    }


    // @View
    // public async login(ctx){
    //     ctx.types = "text/html;charset=utf-8";
    //     ctx.response.body = `<form action="/api/user/signIn" method="post">
    //         <p>Name: <input name="name" value=""></p>
    //         <p>pwd: <input name="pwd" types="text"></p>
    //         <p><input types="submit" value="Submit"></p>
    //     </form>`;
    // }

    // @Api
    // @Post
    // public async signIn(ctx){
    //     const body = ctx.request.body;
    //     //..
    //     try {
    //         // //mysql query
    //         // const res = await signInBySqlQuery(body.name, body.pwd);
    //         // if (res.length){
    //         //     ctx.rest(JSONResult.ok(res));
    //         // } else{
    //         //     ctx.rest(JSONResult.err("name or pwd is incorrect"))
    //         // }
    //
    //         //map hash
    //         const res = await signIn(body.name, body.pwd);
    //         if (res){
    //             ctx.rest(JSONResult.ok(res));
    //         }else {
    //             ctx.rest(JSONResult.err("name or pwd is incorrect"))
    //         }
    //     }catch (e) {
    //         throw e
    //     }
    // }

    // @Api
    // @Post
    // public async register(ctx){
    //     const body = ctx.request.body;
    //     try {
    //         const res = await addUser(body);
    //         if (res)
    //             ctx.rest(JSONResult.ok())
    //     }catch (e) {
    //         throw e;
    //     }
    // }
}
