import {Table, Column, PrimaryKey, AutoIncrement, AllowNull} from "sequelize-typescript";
import { STRING, INTEGER} from "sequelize";
import BaseEntity from "./BaseEntity";

@Table({tableName: "kvs"})
export default class Kv extends BaseEntity{

    @PrimaryKey
    @AutoIncrement
    @Column(INTEGER)
    id: number;

    @AllowNull(false)
    @Column(STRING)
    name: string;

}
