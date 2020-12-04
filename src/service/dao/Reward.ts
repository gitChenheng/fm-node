import Reward from "@/model/entity/Reward";

export default class RewardDao {

    static async getById (id) {
        return await Reward.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Reward.findOne({
            raw: true,
            where: condition
        });
    }

    static async getAllItems(){
        return await Reward.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id});
    }

    static async updateItemInCondition(item, condition){
        return await Reward.update(
            {item},
            {where: condition}
        )
    }

    static async createItem(item){
        return await Reward.create(item);
    }

    static async destroyItem(id){
        return await Reward.destroy({
            where: {id}
        });
    }

}
