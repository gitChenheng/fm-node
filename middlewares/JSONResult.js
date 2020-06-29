module.exports={
    ok:(data,msg)=>{
        return {
            code:'1',
            data:data||null,
            msg:msg||'ok',
        }
    },
    err:(msg)=>{
        return {
            code:'0',
            msg:msg||'unknown_error',
        }
    },
    authority:(msg)=>{
        return {
            code:'4',
            msg:msg||'身份验证失败'
        }
    },
    build:(options)=>{
        return {
            ...options,
        }
    },
};
