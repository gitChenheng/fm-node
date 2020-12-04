import Participate from "@/model/entity/Participate";
import {dbCtx} from "@/server/db/db_context";

export default class ParticipateDao {

    static async getById (id) {
        return await Participate.findOne({raw: true, where: {id}})
    }

    static async queryInCondition(condition){
        const db = dbCtx();
        return await db.query(`SELECT * FROM participate WHERE uid=:uid AND infoid=:infoid;`,
            {
            type: db.QueryTypes.SELECT,
            plain: false,
            raw: true,
            replacements: {
                uid: String(condition.uid),
                infoid:  Number(condition.infoid),
            }
        })
    }

    static async getInCondition(condition){
        return await Participate.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Participate.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        return await Participate.update(
            item,
            {where: condition}
        )
    }

    static async createItem(item){
        return await Participate.create(item);
    }

    static async destroyItem(item){
        await Participate.destroy({
            where: item
        });
    }

    static async restoreItem(condition){
        const db = dbCtx();
        await db.query(`UPDATE participate SET deleted_at=NULL WHERE uid=:uid AND infoid=:infoid;`,
            {
                type: db.QueryTypes.UPDATE,
                plain: false,
                raw: true,
                replacements: {
                    uid: String(condition.uid),
                    infoid: Number(condition.infoid),
                }
            })
    }

    static async findOrCreateItem(id, item){
    }

}
