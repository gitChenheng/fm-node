import log4 from "log4js";
import {ENV_DEV} from "@/constans/global";

const type: string = process.env.NODE_ENV === ENV_DEV ? "console" : "file";

log4.configure({
    appenders: {
        out: {
            type, filename: "./log/default", pattern: "yyyy-MM-dd.log", alwaysIncludePattern: true,
            encoding: "utf-8", keepFileExt: true, maxLogSize: 10485760, backups: 3
        },
        // httpLog: {
        //     type: "file", filename: "./log/httpAccess", pattern: "-yyyy-MM-dd.log",
        //     keepFileExt: true, maxLogSize: 10485760, backups: 3},
        // errorLog: {
        //     type: "file", filename: "./log/error", pattern: "-yyyy-MM-dd.log",
        //     keepFileExt: true, maxLogSize: 10485760, backups: 3
        // },
    },
    categories: {
        // error: { appenders: ["errorLog"], level: "debug" },
        // http: { appenders: ["httpLog"], level: "debug" },
        default: {appenders: [ "out" ], level: "debug"}
    },
})

export const logger = log4.getLogger();

export const info = (msg) => {
    logger.info(msg);
}
export const warn = (msg) => {
    logger.warn(msg);
}
export const debug = (msg) => {
    logger.debug(msg);
}
export const error = (msg) => {
    logger.error(msg);
}

// const httpLog = log4.getLogger("http");
// const httpLogger = log4.connectLogger(httpLog, { level: "WARN" });
