import InfoDao from "@/service/dao/InfoDao";
import TypeDao from "@/service/dao/Type";
import PlatformDao from "@/service/dao/PlatformDap";
import Sequelize from "sequelize";

export default class InfoService{

    static async getAllInfos(){
        return InfoDao.getAllItems();
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

    static async publishInfo(){
        return 1
    }

}
