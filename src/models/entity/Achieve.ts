import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "achieves"})
export default class Achieve extends BaseEntity{

    @Column(STRING)
    public name: string;

    @Column(INTEGER)//成就点数
    public point: number;

    @AllowNull
    @Column(TEXT)//达成条件
    public conditions: string;

}
