import {Table, Column, AllowNull, ForeignKey, BelongsTo} from "sequelize-typescript";
import { STRING, TEXT, INTEGER } from "sequelize";
import BaseEntity from "../common/BaseEntity";
import User from "@/model/entity/User";
import Info from "@/model/entity/Info";

@Table({tableName: "participate"})
export default class Participate extends BaseEntity{

    @ForeignKey(() => User)
    @Column(STRING)
    public uid: string;

    @BelongsTo(() => User)
    public user: User;

    @ForeignKey(() => Info)
    @Column(INTEGER)
    public infoid: number;

    @BelongsTo(() => Info)
    public info: Info

}

