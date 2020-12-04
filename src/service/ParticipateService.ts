import ParticipateDao from "@/service/dao/ParticipateDao";

export default class ParticipateService{

    static async getAllParticipates(){
        return ParticipateDao.getAllItems();
    }

    static async addParticipate(item){
        return await ParticipateDao.createItem(item);
    }

    static async changeParticipate(item, condition){
        return await ParticipateDao.updateItemInCondition(item, condition)
    }

    static async findUpdateOrCreateParticipate(condition){
        const res = await ParticipateDao.queryInCondition(condition);
        if (res.length){
            await ParticipateDao.restoreItem(condition);
        }else{
            await ParticipateDao.createItem(condition)
        }
    }

    static async deleteParticipate(item){
        await ParticipateDao.destroyItem(item);
    }

}
