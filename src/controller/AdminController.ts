import JSONResult from "../utils/JSONResult";
import {Controller, RequestMapping, RequestMethod, RequestParams, RequestPrefix, Validate} from "@/decorator/Dcontroller";
import PlatformDao from "@/service/dao/PlatformDap";
import TypeDao from "@/service/dao/TypeDao";
import AdminService from "@/service/AdminService";
import {upload} from "@/service/common/upload";
import UserService from "@/service/UserService";

@Controller
@RequestPrefix('/admin')
export default class AdminController{

    @Validate
    @RequestMapping('/addPlatform', RequestMethod.POST)
    public async addPlatform(
        ctx,
        @RequestParams([
            {name: 'name', require: true},
            {name: 'platformImgUrl', require: true},
        ]) body
    ) {
        try {
            const res = await PlatformDao.createItem(body);
            ctx.rest(JSONResult.ok(res));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

    @Validate
    @RequestMapping('/uploadPlatformImg', RequestMethod.POST)
    public async uploadPlatformImg(
        ctx,
        @RequestParams({name: 'platformId', require: true}) body
    ){
        try {
            const isAdmin = await UserService.isAdmin(ctx);
            if (isAdmin){
                const id = body.platformId;
                const platform = await AdminService.findPlatform(id);
                if (platform){
                    const filePath = await upload(ctx);
                    await AdminService.changePlatformInfo({platformImgUrl: filePath}, {id});
                    ctx.rest(JSONResult.ok());
                }else{
                    ctx.rest(JSONResult.ok(null, '未查询到相关平台', 2));
                }
            }else{
                ctx.rest(JSONResult.err('无权限'))
            }
        }catch (e) {
            ctx.rest(JSONResult.err(e))
        }
    };

    @Validate
    @RequestMapping('/addType', RequestMethod.POST)
    public async addType(
        ctx,
        @RequestParams({name: 'name', require: true}) body
    ) {
        try {
            const res = await TypeDao.createItem(body);
            ctx.rest(JSONResult.ok(res));
        }catch (e) {
            ctx.rest(JSONResult.err(e));
        }
    }

}
