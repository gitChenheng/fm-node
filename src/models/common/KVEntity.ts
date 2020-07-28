import {Table, Column, PrimaryKey, AutoIncrement} from "sequelize-typescript";
import { STRING, INTEGER} from "sequelize";
import BaseEntity from "./BaseEntity";

@Table({tableName: "kvs"})
export default class KVEntity extends BaseEntity{

    @PrimaryKey
    @AutoIncrement
    @Column(INTEGER)
    id: number;

    @Column(STRING)
    name: string;

}
