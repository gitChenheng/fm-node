import MessageBoard from "@/model/entity/MessageBoard";

export default class MessageBoardDao {

    static async getById (id) {
        return await MessageBoard.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await MessageBoard.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await MessageBoard.findAll();
    }

    static async updateItemById(item, id){
        const itemObj = await this.getById(id);
        for (const key in item)
            itemObj[key] = item[key];
        return await itemObj.save();
    }

    static async updateItemInCondition(item, condition){
        return await MessageBoard.update(
            {item},
            {where: condition}
        )
    }

    static async createItem(item){
        return await MessageBoard.create(item);
    }

    static async destroyItem(id){
        return await MessageBoard.destroy({
            where: {id}
        });
    }

}
