import {Table, Column, AllowNull, ForeignKey, BelongsTo} from "sequelize-typescript";
import { STRING, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";
import User from "@/model/entity/User";

@Table({tableName: "sign"})
export default class Sign extends BaseEntity{

    @ForeignKey(() => User)
    @Column(STRING)
    public uid: string;

    @BelongsTo(() => User)
    public user: User;

    @AllowNull
    @Column(TEXT)
    public address: string;

}

