let cache_object= {};
module.exports={
    show_cache:()=>{
        console.log(cache_object)
    },
    get:(key)=>{
        if(cache_object[key]&&cache_object[key].value){
            const v=cache_object[key].value;
            const e=cache_object[key].expire;
            if(e){
                const now=new Date().getTime();//ms
                if(e>now){
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
    },
    set:(key,value,expire)=>{
        const now=new Date().getTime();
        cache_object[key]={
            value,
            expire:expire?expire*1000+now:0
        };
    },
    del:(key)=>{
        if(cache_object[key])
            delete cache_object[key];
    },
    clear:()=>{
        cache_object={};
    }
}
