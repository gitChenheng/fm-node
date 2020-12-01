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
        const itemObj = await this.getById(id);
        for (const key in item)
            itemObj[key] = item[key];
        return await itemObj.save();
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
