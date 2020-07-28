export default {
    ok: (data?, msg?: string) => {
        return {
            code: "1",
            data: data || null,
            msg: msg || "ok",
        }
    },
    err: (msg?: string) => {
        return {
            code: "0",
            msg: msg || "unknown_error",
        }
    },
    authority: (msg?: string) => {
        return {
            code: "4",
            msg: msg || "身份验证失败"
        }
    },
    build: (options) => {
        return {
            ...options,
        }
    },
};
