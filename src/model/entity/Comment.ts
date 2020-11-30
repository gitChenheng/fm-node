import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "comment"})
export default class Comment extends BaseEntity{

    @Column(INTEGER)
    public infoid: number;

    @AllowNull
    @Column(INTEGER)
    public pid: number;

    @Column(TEXT)
    public content: string;

    @Column(STRING)
    public uid: string;

    @AllowNull
    @Column({type: TEXT, field: 'avatar_url'})
    public avatarUrl: string;
}
