import {errCode, UNAUTHORIZED} from "@/constans/errcode";

export default {
    ok: (data?, msg?: string, code?: number | string) => {
        return {
            status: 200,
            body: {
                code: code || 1,
                data: data || null,
                msg: msg || "Ok",
            },
        }
    },
    err: (msg?: string, code?: number | string) => {
        return {
            status: 400,
            body: {
                code: code || 2,
                msg: msg || "Bad request",
            },
        }
    },
    unauthorized: (msg?: string) => {
        return {
            status: 200,
            body: {
                code: errCode.unauthorized,
                msg: msg || UNAUTHORIZED || "Unauthorized to access!",
            },
        }
    },
    forbidden: (msg?: string) => {
        return {
            status: 200,
            body: {
                code: errCode.forbidden,
                msg: msg || "Forbidden to access!",
            },
        }
    },
    build: (options) => {
        return options
    },
};
