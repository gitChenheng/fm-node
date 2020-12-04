import Type from "@/model/entity/Type";

export default class TypeDao {

    static async getById (id) {
        return await Type.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Type.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Type.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        return await Type.update(
            {item},
            {where: condition}
        )
    }

    static async createItem(item){
        return await Type.create(item);
    }

    static async destroyItem(id){
        return await Type.destroy({
            where: {id}
        });
    }

}
