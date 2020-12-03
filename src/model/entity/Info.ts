import {Table, Column, AllowNull, ForeignKey, BelongsTo} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT, DECIMAL, BOOLEAN } from "sequelize";
import BaseEntity from "../common/BaseEntity";
import Type from "@/model/entity/Type";
import Platform from "@/model/entity/Platform";
import User from "@/model/entity/User";

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

    @ForeignKey(() => Type)
    @AllowNull
    @Column(INTEGER)
    public typeid: number;

    @BelongsTo(() => Type)
    public type?: Type;

    @ForeignKey(() => Platform)
    @AllowNull
    @Column(INTEGER)
    public platformid: number;

    @BelongsTo(() => Platform)
    public platform?: Platform;

    @AllowNull
    @Column(INTEGER)
    public methodid: number;

    @AllowNull
    @Column({type: DATE, field: 'start_at'})
    public startAt: Date | string | number;

    @AllowNull
    @Column({type: DATE, field: 'end_at'})
    public endAt: Date | string | number;

    @ForeignKey(() => User)
    @Column(STRING)
    public uid: string;

    @BelongsTo(() => User, 'user_info')
    public user?: User;

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
    @Column({type: TEXT, field: 'reject_reason'})
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
