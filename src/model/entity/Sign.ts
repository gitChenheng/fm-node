import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "sign"})
export default class Sign extends BaseEntity{

    @Column(STRING)
    public uid: string;

    @Column(STRING)
    public name: string;

    @AllowNull
    @Column(TEXT)
    public address: string;

}

