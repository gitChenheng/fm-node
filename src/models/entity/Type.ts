import {Table} from "sequelize-typescript";
import KVEntity from "../common/KVEntity";

@Table({tableName: "types"})
export default class Type extends KVEntity{}
