import {AllowNull, Column, Table} from "sequelize-typescript";
import {STRING} from "sequelize";
import KVEntity from "../common/KVEntity";

@Table({tableName: "platforms"})
export default class Platform extends KVEntity{

    @AllowNull
    @Column(STRING)
    public platformImgUrl: string;

}
