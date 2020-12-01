import UserService from "@/service/UserService";
import JSONResult from "../utils/JSONResult";
import {js_code2_session} from "@/service/common/wx";
import {utf16toEntities} from "@/utils/util";
import {Controller, RequestMapping, RequestMethod, RequestParams, RequestPrefix, Validate} from "@/decorator/Dcontroller";
import BaseController from "@/controller/BaseController";

interface ILoginBody {
    code: string;
    shareid: string;
    nickName: string;
}

@Controller
@RequestPrefix('/api')
export default class UserController extends BaseController{

    @Validate
    @RequestMapping('/login', RequestMethod.POST)
    public async login(
        ctx,
        @RequestParams( [
            {name: 'code', require: true},
            {name: 'shareid', require: true},
            {name: 'nickName', require: true},
        ]) body: ILoginBody,
    ) {
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
                    nickName: utf16toEntities(nickName),
                    credit: 0,
                    balance: 0,
                    role: 1,
                };
                const token = await UserService.updateOrCreateUser(openid, shareid, userItem);
                if (token)
                    ctx.rest(JSONResult.ok({token}, "登录成功"));
            }
        }catch (e) {
            ctx.rest(JSONResult.err(e))
        }
    }

    @RequestMapping('/getUserInfo', RequestMethod.POST)
    public async getUserInfo(ctx) {
        try {
            const uid = await UserService.getUid(ctx);
            if (!uid){
                ctx.rest(JSONResult.unauthorized())
            }else{
                const res = await UserService.getUserById(uid);
                if (res){
                    ctx.rest(JSONResult.ok(res))
                }else{
                    ctx.rest(JSONResult.unauthorized())
                }
            }
        }catch (e) {
            ctx.rest(JSONResult.err(e))
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
