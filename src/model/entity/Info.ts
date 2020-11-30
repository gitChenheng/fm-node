import {Table, Column, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT, DECIMAL, BOOLEAN } from "sequelize";
import BaseEntity from "../common/BaseEntity";

@Table({tableName: "info"})
export default class Info extends BaseEntity{

    @Column(STRING(100))
    public name: string;

    @AllowNull
    @Column(STRING) //金主
    public initiator: string;

    @AllowNull
    @Column(DECIMAL(10, 2))
    public price: number;

    @Column({type: TINYINT, field: 'review_status'})//审核状态 0默认 1通过 2驳回
    public reviewStatus: number;

    @AllowNull
    @Column(TINYINT)//活动星级
    public level: number;

    @AllowNull
    @Column(INTEGER)
    public typeid: number;

    @AllowNull
    @Column(INTEGER)
    public platformid: number;

    @AllowNull
    @Column(INTEGER)
    public methodid: number;

    @AllowNull
    @Column({type: DATE, field: 'start_at'})
    public startAt: Date;

    @AllowNull
    @Column({type: DATE, field: 'end_at'})
    public endAt: Date;

    @Column(STRING)
    public uid: string;

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
    @Column(TEXT)
    public img: string;

    @AllowNull
    @Column(TEXT)
    public details: string;
}
