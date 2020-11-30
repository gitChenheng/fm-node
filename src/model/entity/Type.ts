import {Table} from "sequelize-typescript";
import Kv from "../common/kv";

@Table({tableName: "type"})
export default class Type extends Kv{}
