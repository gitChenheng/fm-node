import JSONResult from "../utils/JSONResult";
import {Controller, RequestMapping, RequestMethod, RequestParams, RequestPrefix, Validate} from "@/decorator/Dcontroller";
import InfoService from "@/service/InfoService";
import UserService from "@/service/UserService";

interface IInfoBody {
    reviewStatus?: number;
    name: string;
    initiator: string;
    price: number;
    level?: number;
    typeid: number;
    platformid: number;
    methodid: number;
    startAt: string;
    endAt: string;
    uid?: string;
    credit?: number;
    anonymous: boolean;
    free: boolean;
    rejectReason?: string;
    link?: string;
    img?: string;
    details?: string;
}

interface IReviewInfoBody {
    id: number;
    reviewStatus: number;
    level?: number;
    credit?: number;
    rejectReason?: string;
}

@Controller
@RequestPrefix('/api')
export default class UserController{

    @RequestMapping('/getAllInfos', RequestMethod.POST)
    public async getAllInfos(ctx) {
        try {
            const res = await InfoService.getAllInfos();
            ctx.rest(JSONResult.ok(res));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @Validate
    @RequestMapping('/getInfoDetail', RequestMethod.POST)
    public async getInfoDetail(
        ctx,
        @RequestParams({name: 'id', require: true}) body
    ){
        const {id} = body;
        try {
            const res = await InfoService.getInfoById(id);
            if (res){
                ctx.rest(JSONResult.ok(res))
            }else{
                ctx.rest(JSONResult.ok(null, '无法查询到该爆料', 2));
            }
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @Validate
    @RequestMapping('/findInfoConditional', RequestMethod.POST)
    public async findInfoConditional(
        ctx,
        @RequestParams([
            {name: 'reviewStatus', require: true},
            {name: 'typeid', require: true},
            {name: 'platformid', require: true},
            {name: 'pageIndex', require: true},
            {name: 'pageSize', require: true},
        ]) body
    ){
        const {reviewStatus, typeid, platformid, search, pageIndex, pageSize} = body;
        if (reviewStatus !== 0 && reviewStatus !== 1 && reviewStatus !== 2){
            ctx.rest(JSONResult.ok(null, "lack of param reviewStatus or reviewStatus beyond the scope", 2));
        }
        try {
            const res = await InfoService.getInfoInConditional(body);
            if (res)
                return ctx.rest(JSONResult.ok(res));
            else
                return ctx.rest(JSONResult.ok(null, "", 2));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @RequestMapping('/getAllListOfAward', RequestMethod.POST)
    public async getAllListOfAward(ctx) {
        try {
            const res = await InfoService.getAllListOfAward();
            ctx.rest(JSONResult.ok(res));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @Validate
    @RequestMapping('/knockInfo', RequestMethod.POST)
    public async knockInfo(
        ctx,
        @RequestParams([
            {name: 'name', require: true},
            {name: 'initiator', require: true},
            {name: 'price', require: true},
            {name: 'level', require: true},
            {name: 'typeid', require: true},
            {name: 'platformid', require: true},
            {name: 'methodid', require: true},
            {name: 'startAt', require: true},
            {name: 'endAt', require: true},
        ]) body: IInfoBody
    ) {
        try {
            const {level, typeid, platformid, methodid, startAt, endAt, anonymous, free} = body;
            body.uid = await UserService.getuid(ctx);
            body.reviewStatus = 0;
            body.credit = 0;
            await InfoService.knockInfo(body);
            ctx.rest(JSONResult.ok(null, "提交成功，请等待审核"));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @Validate
    @RequestMapping('/reviewInfo', RequestMethod.POST)
    public async reviewInfo(
        ctx,
        @RequestParams([
            {name: 'id', require: true},
            {name: 'reviewStatus', require: true},
        ]) body: IReviewInfoBody
    ) {
        const {id, reviewStatus, rejectReason} = body;
        try {
            const isAdmin = await UserService.isAdmin(ctx);
            if (!isAdmin){
                ctx.rest(JSONResult.err('无权限'));
                return ;
            }
            if (reviewStatus === 1){//通过
                if (!body.level){
                    ctx.rest(JSONResult.ok(null, "lack of param `level`", 2));
                    return ;
                }
                body.credit = Number(body.level) * 10;
            }
            await InfoService.reviewInfo(body, body.id);
            ctx.rest(JSONResult.ok());
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

}
