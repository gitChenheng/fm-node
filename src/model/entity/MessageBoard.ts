import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, TEXT, INTEGER } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "message_board"})
export default class MessageBoard extends BaseEntity{

    @AllowNull
    @Column(INTEGER)
    public pid: number;

    @Column(TEXT)
    public content: string;

    @Column(STRING)
    public uid: string;

}
