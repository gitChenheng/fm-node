import {AllowNull, Column, Table} from "sequelize-typescript";
import {STRING, BIGINT, BOOLEAN, TINYINT, TEXT} from "sequelize";
import KVEntity from "../common/KVEntity";

@Table({tableName: "rewards"})
export default class Reward extends KVEntity{

    @AllowNull
    @Column(STRING)
    public rewardImgUrl: string;

    @AllowNull
    @Column(BIGINT)//兑换所需积分
    public needCredit: number;

    @AllowNull
    @Column(BOOLEAN)
    public onShelf: boolean;

    @AllowNull
    @Column(TINYINT)//0.正常奖品 1.每月积分榜第一奖励 2.第二 3.第三 4.
    public type: string;

    @AllowNull
    @Column(TEXT)
    public details: string;

}
