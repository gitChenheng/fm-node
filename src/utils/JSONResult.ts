export default {
    ok: (data?, msg?: string, status?: number) => {
        return {
            status: 200,
            body: {
                code: status || 200,
                data: data || null,
                msg: msg || "Ok",
            },
        }
    },
    err: (msg?: string, status?: number) => {
        return {
            status: 400,
            body: {
                code: status || 400,
                msg: msg || "Bad request",
            },
        }
    },
    unauthorized: (msg?: string) => {
        return {
            code: 401,
            body: {
                msg: msg || "Unauthorized to access!",
            },
        }
    },
    forbidden: (msg?: string) => {
        return {
            code: 403,
            body: {
                msg: msg || "Forbidden to access!",
            },
        }
    },
    build: (options) => {
        return options
    },
};
