import JSONResult from "../utils/JSONResult";
import {Controller, RequestMapping, RequestMethod, RequestParams, RequestPrefix, Validate} from "@/decorator/Dcontroller";
import InfoService from "@/service/InfoService";

interface IInfoBody {
    name: string;
    initiator: string;
    price: number;
    level: number;
    typeid: number;
    platformid: number;
    methodid: number;
    startAt: string;
    endAt: string;
    uid: string;
    credit: number;
    anonymous: boolean;
    free: boolean;
    rejectReason?: string;
    link?: string;
    img?: string;
    details?: string;
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
            {name: 'uid', require: true},
            {name: 'credit', require: true},
        ]) body: IInfoBody
    ) {
        try {
            const {
                level, typeid, platformid, methodid,
                startAt, endAt, uid, credit, anonymous, free,
            } = body;
            // await InfoService.knockInfo(body);
            ctx.rest(JSONResult.ok(null, "提交成功，请等待审核"));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @RequestMapping('/publishInfo', RequestMethod.POST)
    public async publishInfo(ctx) {
        try {
            const res = await InfoService.publishInfo();
            ctx.rest(JSONResult.ok(res));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

}
