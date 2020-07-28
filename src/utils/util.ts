export const generateId = (length: number, radix?: number) => {
    return Number(
        Math.random().toString().substr(2, length || 0) + Date.now()
    ).toString(radix || 36);
}

export const utf16toEntities = (str) => {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str  =  str.replace(patt, (char) => {
        let H;
        let L;
        let code;
        if (char.length === 2) {
            H  =  char.charCodeAt(0); // 取出高位
            L  =  char.charCodeAt(1); // 取出低位
            code  =  (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
    return str;
}

export const uncodeUtf16 = (str) => {
    const reg  =  /\&#.*?;/g;
    return str.replace(reg, (char) => {
        let H;
        let L;
        let code;
        if (char.length === 9 ){
            code = parseInt(char.match(/[0-9]+/g), 0);
            H  =  Math.floor((code - 0x10000) / 0x400) + 0xD800;
            L  =  (code - 0x10000) % 0x400 + 0xDC00;
            return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
        }else{
            return char;
        }
    });
}

export const checkPhone = (phone) => {
    return /^1[3456789]\d{9}$/.test(phone)
}

export const decodeDate = (date, hms) => {
    if (hms){
        return new Date(date).getFullYear() + "-" + (Number(new Date(date).getMonth()) + 1) + "-" + new Date(date).getDate() + `${hms && (
            " " + new Date(date).getHours() + ":" + new Date(date).getMinutes() + ":" + new Date(date).getSeconds()
        )}`;
    }else{
        return new Date(date).getFullYear() + "-" + (Number(new Date(date).getMonth()) + 1) + "-" + new Date(date).getDate()
    }
}
