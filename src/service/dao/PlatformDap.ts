import Platform from "@/model/entity/Platform";

export default class PlatformDao {

    static async getById (id) {
        return await Platform.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Platform.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Platform.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        return await Platform.update(
            item,
            {where: condition}
        )
    }

    static async createItem(item){
        return await Platform.create(item);
    }

    static async destroyItem(id){
        return await Platform.destroy({
            where: {id}
        });
    }

}
