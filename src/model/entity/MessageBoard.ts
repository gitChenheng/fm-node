import {Table, Column, AllowNull, ForeignKey, BelongsTo} from "sequelize-typescript";
import { STRING, TEXT, INTEGER } from "sequelize";
import BaseEntity from "../common/BaseEntity";
import User from "@/model/entity/User";

@Table({tableName: "message_board"})
export default class MessageBoard extends BaseEntity{

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
