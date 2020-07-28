import {Table} from "sequelize-typescript";
import KVEntity from "../common/KVEntity";

@Table({tableName: "methods"})
export default class Method extends KVEntity{}
