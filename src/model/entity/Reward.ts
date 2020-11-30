import {AllowNull, Column, Table} from "sequelize-typescript";
import {STRING, BIGINT, BOOLEAN, TINYINT, TEXT} from "sequelize";
import Kv from "../common/kv";

@Table({tableName: "reward"})
export default class Reward extends Kv{

    @AllowNull
    @Column({type: TEXT, field: 'reward_img_url'})
    public rewardImgUrl: string;

    @AllowNull
    @Column({type: BIGINT, field: 'need_credit'})//兑换所需积分
    public needCredit: number;

    @AllowNull
    @Column(BOOLEAN)
    public shelf: boolean; //上架

    @AllowNull
    @Column(TINYINT)//0.正常奖品 1.每月积分榜第一奖励 2.第二 3.第三 4.
    public type: string;

    @AllowNull
    @Column(TEXT)
    public details: string;

}
