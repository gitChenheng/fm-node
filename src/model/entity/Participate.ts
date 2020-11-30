import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, TEXT, INTEGER } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "participate"})
export default class Participate extends BaseEntity{

    @Column(STRING)
    public uid: string;

    @Column(INTEGER)
    public infoid: number;

}

