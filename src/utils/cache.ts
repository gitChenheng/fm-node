let cache_object = {};
export const show_cache = () => {
    console.log(cache_object)
}
export const get = (key) => {
    if (cache_object[key] && cache_object[key].value){
        const v = cache_object[key].value;
        const e = cache_object[key].expire;
        if (e){
            const now = new Date().getTime(); //ms
            if (e > now){
                return v;
            }else{
                return null;
            }
        }else{
            return v;
        }
    }else{
        return null;
    }
}
export const set = (key, value, expire) => {
    const now = new Date().getTime();
    cache_object[key] = {
    value,
    expire: expire ? expire * 1000 + now : 0
};
}
export const del = (key) => {
    if (cache_object[key])
    delete cache_object[key];
}
export const clear = () => {
    cache_object = {};
}
