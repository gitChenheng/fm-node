import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, TEXT, INTEGER } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "participates"})
export default class Participate extends BaseEntity{

    @Column(STRING)
    public uid: string;

    @Column(INTEGER)
    public infoId: number;

}

