import Sign from "@/model/entity/Sign";

export default class SignDao {

    static async getById (id) {
        return await Sign.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Sign.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Sign.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        return await Sign.update(
            item,
            {where: condition}
        )
    }

    static async createItem(item){
        return await Sign.create(item);
    }

    static async destroyItem(id){
        return await Sign.destroy({
            where: {id}
        });
    }

}
