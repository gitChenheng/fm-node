import InfoDao from "@/service/dao/InfoDao";
import TypeDao from "@/service/dao/Type";
import PlatformDao from "@/service/dao/PlatformDap";
import UserDao from "@/service/dao/UserDao";
import {Sequelize} from "sequelize";
import {timeFormat} from "@/utils/util";
import ParticipateDao from "@/service/dao/ParticipateDao";
import UserService from "@/service/UserService";

export default class InfoService{

    static async getAllInfos(){
        return InfoDao.getAllItems();
    }

    static async getMyInfos(ctx, pageIndex, pageSize){
        const uid = await UserService.getUid(ctx);
        const res = await InfoDao.getMyItems(uid, pageIndex, pageSize);
        for (const o of res){
            o.startAt = timeFormat(o.startAt);
            o.endAt = timeFormat(o.endAt);
            o.createdAt = timeFormat(o.createdAt);
        }
        return res;
    }

    static async getInfoById(id){
        const res = await InfoDao.getById(id);
        const participate = await ParticipateDao.queryInCondition({uid: res.uid, infoid: id});
        if (participate.length){
            res.participate = !participate[0].deleted_at;
        }
        const platform = await PlatformDao.getById(res.platformid);
        res.platformImgUrl = platform.platformImgUrl;
        res.startAt = timeFormat(res.startAt);
        res.endAt = timeFormat(res.endAt);
        return res;
    }

    static async getInfoInConditional(item){
        return await InfoDao.queryAllInCondition(item);
    }

    static async getAllListOfAward(){
        const types = await TypeDao.getAllItems();
        const platforms = await PlatformDao.getAllItems();
        return {
            types, platforms
        }
    }

    static async knockInfo(item){
        return InfoDao.createItem(item);
    }

    static async reviewInfo(item, id): Promise<void>{
        const info = await InfoDao.getById(id);
        await InfoDao.updateItemById(item, id);
        if (item.reviewStatus === 1){//通过
            await UserDao.updateItemInCondition(
                {credit: Sequelize.literal('`credit`+' + item.credit)},
                {id: info.uid}
                )
        }
    }

}
