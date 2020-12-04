import {Table, Column, AllowNull, ForeignKey, BelongsTo} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";
import Info from "@/model/entity/Info";
import User from "@/model/entity/User";

@Table({tableName: "comment"})
export default class Comment extends BaseEntity{

    @ForeignKey(() => Info)
    @Column(INTEGER)
    public infoid: number;

    @BelongsTo(() => Info)
    public info: Info;

    @AllowNull
    @Column(INTEGER)
    public pid: number;

    @Column(TEXT)
    public content: string;

    @ForeignKey(() => User)
    @Column(STRING)
    public uid: string;

    @BelongsTo(() => User)
    public user: User;

}
