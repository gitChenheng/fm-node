import "module-alias/register";
import config from "@/config/config";
import path from "path";
import {Sequelize} from "sequelize-typescript";
import {info} from "@/utils/log4";

let db_context: Sequelize = null;

/**
 * mysql 操作手册
 * from_unixtime/unix_timestamp 日期/时间戳 互转
 */

export const createDbContext = () => {
    db_context = new Sequelize({
        ...config.mysql,
        operatorsAliases: false, //是否识别字段别名中的下划线
        logging: sql => info(sql),
        define: {
            timestamps: true, //开启时间戳
            paranoid: true, //开启假删除
            underscored: true, //下划线
            charset: "utf8",
            freezeTableName: false //固定表名为单数
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: "+08:00", //东八时区
        modelPaths: [path.join(process.cwd(), "/src/model/entity/")]
    })
    return db_context;
}

export const dbCtx = () => {
    return db_context;
}
