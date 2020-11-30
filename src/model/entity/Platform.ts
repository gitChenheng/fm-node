import {AllowNull, Column, Table} from "sequelize-typescript";
import {STRING} from "sequelize";
import Kv from "../common/kv";

@Table({tableName: "platform"})
export default class Platform extends Kv{

    @AllowNull
    @Column({type: STRING, field: 'platform_img_url'})
    public platformImgUrl: string;

}
