import PlatformDao from "@/service/dao/PlatformDap";

export default class AdminService {

    static async findPlatform(id){
        return await PlatformDao.getById(id);
    }

    static async changePlatformInfo(item, condition){
        return await PlatformDao.updateItemInCondition(item, condition)
    }

}
