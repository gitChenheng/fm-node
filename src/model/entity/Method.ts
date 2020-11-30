import {Table} from "sequelize-typescript";
import Kv from "../common/kv";

@Table({tableName: "method"})
export default class Method extends Kv{}
