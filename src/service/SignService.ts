import SignDao from "@/service/dao/SignDao";

export default class SignService{

    static async getAllSigns(){
        return SignDao.getAllItems();
    }

    static async addSign(item){
        return await SignDao.createItem(item);
    }

    static async changeSign(item, condition){
        return await SignDao.updateItemInCondition(item, condition)
    }

}
