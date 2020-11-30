import {Model, Table, Column, PrimaryKey, AllowNull} from "sequelize-typescript";
import { STRING, DATE, INTEGER, TINYINT, BIGINT, TEXT, BOOLEAN, DECIMAL } from "sequelize";

@Table({tableName: "user"})
export default class User extends Model<User>{

    @PrimaryKey
    @Column(STRING)
    public id: string;

    @AllowNull
    @Column(STRING)
    public openid: string;

    @AllowNull
    @Column(STRING)
    public shareid: string;

    @AllowNull
    @Column(TINYINT) // 1.用户 10.管理
    public role: number;

    @AllowNull
    @Column({type: STRING, field: "nick_name"})
    public nickName: string;

    @AllowNull
    @Column(STRING(20))
    public phone: string;

    @AllowNull
    @Column(STRING(20))
    public pwd: string;

    @AllowNull
    @Column(BIGINT) // 积分
    public credit: number;

    @AllowNull
    @Column(DECIMAL(20, 2))//充值余额 总长，小数点右边长度
    public balance: number;

    @AllowNull
    @Column(DATE)
    public lastSignInTime: Date;

    @AllowNull
    @Column(INTEGER)
    public continueSign: number;

    @AllowNull
    @Column(TEXT)
    public achieve: string;

    @AllowNull
    @Column(INTEGER)
    public authority: number;

    @AllowNull
    @Column(BOOLEAN)
    public gender: boolean;

    @AllowNull
    @Column({type: TEXT, field: "avatar_url"})
    public avatarUrl: string;

    @AllowNull
    @Column(STRING(50))
    public city: string;

    @AllowNull
    @Column(STRING(50))
    public province: string;

    @AllowNull
    @Column(STRING(50))
    public country: string;

    @AllowNull
    @Column(STRING(20))
    public language: string;

    @AllowNull
    @Column(TEXT) // 收货地址
    public address: string;

}
