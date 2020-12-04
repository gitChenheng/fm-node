import UserService from "@/service/UserService";
import JSONResult from "../utils/JSONResult";
import {js_code2_session} from "@/service/common/wx";
import {utf16toEntities} from "@/utils/util";
import {Controller, RequestMapping, RequestMethod, RequestParams, RequestPrefix, Validate} from "@/decorator/Dcontroller";
import BaseController from "@/controller/BaseController";
import Sequelize from "sequelize";
import SignService from "@/service/SignService";
import fs from "fs";
import User from "@/model/entity/User";

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
            const todayEarly = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
            if (!uid){
                ctx.rest(JSONResult.unauthorized())
            }else{
                const res = await UserService.getUserById(uid);
                const lastSignTime = res.lastSignInTime;
                if (new Date(lastSignTime).getTime() >= todayEarly){
                    res.hadSignIn = 1;
                }else{
                    res.hadSignIn = 0
                }
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

    @Validate
    @RequestMapping('/updateUserInfo', RequestMethod.POST)
    public async updateUserInfo(
        ctx,
        @RequestParams({name: 'address', require: true}) body
    ){
        try {
            const {address} = body;
            const id = await UserService.getUid(ctx);
            await UserService.changeUserInfo({address}, {id});
            ctx.rest(JSONResult.ok());
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @RequestMapping('/sign', RequestMethod.POST)
    public async sign(ctx){
        try {
            const uid = await UserService.getUid(ctx);
            const userInfo = await UserService.getUserById(uid);
            const now = Date.now();
            if (!userInfo.lastSignInTime){//从未签到
                await SignService.addSign({uid});
                await UserService.changeUserInfo(
                    {
                        lastSignInTime: now,
                        continueSign: 1,
                        credit: Sequelize.literal('`credit`+10')
                    },
                    {id: uid}
                )
                ctx.rest(JSONResult.ok(null, `首次签到成功，积分 + ${10}`))
            }else{//已签到
                //今日凌晨时间戳
                const todayEarly = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                //昨日凌晨时间戳
                const yesterdayEarly = todayEarly - 24 * 60 * 60 * 1000;
                const lastSignTime = userInfo.lastSignInTime;
                if (lastSignTime < yesterdayEarly){//最近签到时间早于昨天
                    await SignService.addSign({uid});
                    await UserService.changeUserInfo(
                        {
                            lastSignInTime: now,
                            continueSign: 1,
                            credit: Sequelize.literal('`credit`+1')
                        },
                        {id: uid}
                    )
                    ctx.rest(JSONResult.ok(null, `签到成功，积分 + ${1}`))
                }else if (lastSignTime >= yesterdayEarly && lastSignTime < todayEarly){//昨天签到
                    const continueSign = userInfo.continueSign;
                    const largestIrcCredit = 5;
                    let ircCredit: number;
                    if (Number(continueSign) >= (largestIrcCredit - 1)){
                        ircCredit = largestIrcCredit;
                    }else{
                        ircCredit = Number(continueSign) + 1;
                    }
                    await SignService.addSign({uid});
                    await UserService.changeUserInfo(
                        {
                            lastSignInTime: now,
                            continueSign: Sequelize.literal('`continueSign`+1'),
                            credit: Sequelize.literal('`credit`+' + String(ircCredit))
                        },
                        {id: uid}
                    )
                    ctx.rest(JSONResult.ok(null, `连续签到成功，积分 + ${ircCredit}`));
                }else{//今天已签到
                    ctx.rest(JSONResult.ok(null, `今日已签到过`));
                }
            }
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @RequestMapping('/getAddressList')
    public async getAddressList(ctx){
        try {
            const addressJSONFile = fs.readFileSync(`${process.cwd()}/utils/address.json`).toString();
            const adrObjArr = JSON.parse(addressJSONFile);
            ctx.rest(JSONResult.ok(adrObjArr))
        }catch (e) {
            ctx.rest(JSONResult.err(e));
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
