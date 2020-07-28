import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT, DECIMAL, BOOLEAN } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "infos"})
export default class Info extends BaseEntity{

    @Column(STRING(100))
    public name: string;

    @AllowNull
    @Column(STRING)
    public initiator: string;

    @AllowNull
    @Column(DECIMAL(10, 2))
    public price: number;

    @Column(TINYINT)//审核状态 0默认 1通过 2驳回
    public reviewStatus: number;

    @AllowNull
    @Column(TINYINT)//活动星级
    public level: number;

    @AllowNull
    @Column(INTEGER)
    public typeId: number;

    @AllowNull
    @Column(STRING)
    public type: string;

    @AllowNull
    @Column(INTEGER)
    public platformId: number;

    @AllowNull
    @Column(STRING)
    public platform: string;

    @AllowNull
    @Column(TEXT)
    public platformImgUrl: string;

    @AllowNull
    @Column(INTEGER)
    public methodId: number;

    @AllowNull
    @Column(STRING)
    public method: string;

    @AllowNull
    @Column(DATE)
    public startTime: Date;

    @AllowNull
    @Column(DATE)
    public endTime: Date;

    @Column(STRING)
    public authorId: string;

    @Column(STRING)
    public author: string;

    @AllowNull
    @Column(BIGINT)
    public credit: number;

    @AllowNull
    @Column(BOOLEAN)//是否匿名
    public anonymous: boolean;

    @AllowNull
    @Column(BOOLEAN)
    public free: boolean;

    @AllowNull
    @Column(TEXT)
    public rejectReason: string;

    @AllowNull
    @Column(TEXT)
    public link: string;

    @AllowNull
    @Column(STRING)
    public imgs: string;

    @AllowNull
    @Column(TEXT)
    public details: string;
}
