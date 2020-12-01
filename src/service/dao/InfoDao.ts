import Info from "@/model/entity/Info";

export default class InfoDao {

    static async getById (id) {
        return await Info.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Info.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Info.findAll();
    }

    static async updateItemById(item, id){
        const itemObj = await this.getById(id);
        for (const key in item)
            itemObj[key] = item[key];
        return await itemObj.save();
    }

    static async updateItemInCondition(item, condition){
        return await Info.update(
            {item},
            {where: condition}
        )
    }

    static async createItem(item){
        return await Info.create(item);
    }

    static async destroyItem(id){
        return await Info.destroy({
            where: {id}
        });
    }

}
