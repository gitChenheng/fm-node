import User from "@/model/entity/User";
import {generateId} from "@/utils/util";

export default class UserDao {

    static async getById (id): Promise<any>{
        return await User.findOne({raw: true, where: {id}})
    }

    static async getByOpenid(openid){
        return await User.findOne({
            raw: true,
            where: {openid}
        });
    }

    static async getInCondition(condition){
        return await User.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await User.findAll();
    }

    static async updateItemById(item, id){
        const itemObj = await this.getById(id);
        for (const key in item)
            itemObj[key] = item[key];
        return await itemObj.save();
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
