import InfoDao from "@/service/dao/InfoDao";
import TypeDao from "@/service/dao/Type";
import PlatformDao from "@/service/dao/PlatformDap";
import UserDao from "@/service/dao/UserDao";
import {Sequelize} from "sequelize";

export default class InfoService{

    static async getAllInfos(){
        return InfoDao.getAllItems();
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
