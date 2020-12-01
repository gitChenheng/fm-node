import fs from "fs";
import path from "path";
import {generateId} from "@/utils/util";
import JSONResult from "@/utils/JSONResult";

export const upload = async (ctx) => {
    const fileName = ctx.request.body.name || generateId(6, 16);
    const file = ctx.request.files.file;
    if (file.size > 10000000){
        ctx.rest(JSONResult.err("上传文件过大，请不要超过10M"));
        return;
    }
    // 创建可读流
    const render = fs.createReadStream(file.path);
    const filePath = path.join(process.cwd(), "/src/public/upload/", fileName + "." + file.name.split(".").pop());
    const fileDir = path.join(process.cwd(), "/src/public/upload/");
    if (!fs.existsSync(fileDir)) {
        // @ts-ignore
        fs.mkdirSync(fileDir, (err: any) => {
            console.log(err);
            console.log("创建失败");
            return null;
        });
    }
    // 创建写入流
    const upStream = fs.createWriteStream(filePath);
    render.pipe(upStream);
    return `/upload/${fileName + "." + file.name.split(".").pop()}`;
    // const files = ctx.request.files.file;
    // for (let file of files) {
    //     // 创建可读流
    //     const reader = fs.createReadStream(file.path);
    //     // 获取上传文件扩展名
    //     let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
    //     // 创建可写流
    //     const upStream = fs.createWriteStream(filePath);
    //     // 可读流通过管道写入可写流
    //     reader.pipe(upStream);
    // }
};
