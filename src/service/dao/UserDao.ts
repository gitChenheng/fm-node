import User from "@/model/entity/User";
import {generateId, uncodeUtf16} from "@/utils/util";

export default class UserDao {

    static async getById (id): Promise<any>{
        const res = await User.findOne({raw: true, where: {id}})
        res.nickName = uncodeUtf16(res.nickName);
        return res;
    }

    static async getByOpenid(openid){
        const res = await User.findOne({
            raw: true,
            where: {openid}
        });
        res.nickName = uncodeUtf16(res.nickName);
        return res;
    }

    static async getInCondition(condition){
        const res = await User.findOne({
            raw: true,
            where: condition
        });
        res.nickName = uncodeUtf16(res.nickName);
        return res;
    }

    static async getAllItems(){
        return await User.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        await User.update(
            item,
            {where: condition}
        )
    }

    static async createItem(item){
        item = {
            id: generateId(5),
            ...item,
        }
        return await User.create(item);
    }

    static async destroyItem(id){
        return await User.destroy({
            where: {id}
        });
    }

}
