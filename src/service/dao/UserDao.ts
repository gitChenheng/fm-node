import User from "@/model/entity/User";
import {generateId} from "@/utils/util";
import {dbCtx} from "@/server/db/db_context";

export default class UserDao {

    static async getById (id) {
        return await User.findOne({raw: true, where: {id}})
    }

    static async getByOpenid(openid){
        return await User.findOne({
            raw: true,
            where: {openid}
        });
        // const db = dbCtx();
        // return await db.query(`SELECT count(*) FROM users where openid=:openid`, {
        //     types: db.QueryTypes.SELECT,
        //     plain: false,
        //     raw: true,
        //     replacements: {
        //         openid,
        //     }
        // })
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
        return await User.update(
            {item},
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
