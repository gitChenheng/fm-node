import {Model, Table, Column, PrimaryKey, AutoIncrement} from "sequelize-typescript";
import { STRING, INTEGER, DATE, TINYINT, BIGINT, TEXT } from "sequelize";

@Table({tableName: "base_table"})
export default class BaseEntity extends Model<BaseEntity>{

    @PrimaryKey
    @AutoIncrement
    @Column(INTEGER)
    id: number;

    [index: string]: any;

    static async createItem<T extends BaseEntity>(item: T){
        return await this.create(item);
    }

    static async deleteById<T extends BaseEntity>(id: number){
        return await this.destroy({
            where: {id}
        });
    }

    static async getById<T extends BaseEntity>(id: number){
        const item = await this.findOne({
            raw: true,
            where: {id}
        });
        return item as T;
    }

    static async updateItemById<T extends BaseEntity>(item: T, id: number){
        const objItem = await this.getById(id) as T;
        for (const key in item)
            objItem[key] = item[key];
        return await objItem.save();
    }

    static async getList<T extends BaseEntity>(){
        const items = await this.findAll({raw: true});
        return items as T[];
    }

}
