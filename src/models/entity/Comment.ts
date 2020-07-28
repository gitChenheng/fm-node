import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "comments"})
export default class Comment extends BaseEntity{

    @Column(INTEGER)
    public infoId: number;

    @AllowNull
    @Column(INTEGER)
    public pid: number;

    @Column(TEXT)
    public content: string;

    @Column(STRING)
    public createdUid: string;

    @Column(STRING)
    public createdName: string;

    @AllowNull
    @Column(TEXT)
    public avatarUrl: string;
}
