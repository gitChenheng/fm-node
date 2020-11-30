import UserDao from "@/service/dao/UserDao";
import {_compare, _hash} from "@/utils/hash";
import {sign} from "@/utils/helper/middleware";
import Sequelize from "sequelize";
import {setRedisData, getRedisData} from "@/service/common/redisSer";
import {JWT_SECRET} from "@/constans/global";
import jwt from "jsonwebtoken";
import BaseService from "@/service/BaseService";

export default class UserService extends BaseService{

    static async createToken(uid: string){
        const userInfo = {
            uid,
            timestamp: Date.now(),
        };
        const token = sign(userInfo);
        await setRedisData(token, userInfo);
        return token;
    }

    static async getUid(ctx){
        const token = ctx.request.header.token;
        if (token){
            const userInfo = await getRedisData(token);
            if (userInfo){
                return JSON.parse(userInfo).uid;
            } else{
                await jwt.verify(token, JWT_SECRET, null, async (err, decoded) => {
                    if (err){
                        return null;
                    }else{
                        return decoded.uid
                    }
                });
            }
        }else{
            return null;
        }
    }

    static async getUserById(uid: string){
        return await UserDao.getById(uid);
    }

    static async changeUserInfo(item, condition) {
        await UserDao.updateItemInCondition(item, condition);
    }

    static async getAllUsers(){
        return await UserDao.getAllItems();
    }

    // static async signIn(name: any, pwd: any){
    //     const user = await getByName(name);
    //     const hashResult = await _compare(String(pwd), String(user.pwd));
    //     const date = new Date();
    //     if (hashResult) {
    //         const userInfo = {
    //             uid: id,
    //             timestamp: date.getTime()
    //         };
    //         const token = sign(userInfo);
    //         await newRedis.set(token, JSON.stringify(userInfo));
    //         await newRedis.expire(token, 30 * 24 * 60 * 60);
    //         return token;
    //     }
    //     if (hashResult){
    //         return user;
    //     }else{
    //         return false;
    //     }
    // }

    static async addUser(obj){
        return await UserDao.createItem({
            ...obj,
        });
    }

    static async updateOrCreateUser(openid, shareid, obj){
        let itemObj = await UserDao.getInCondition({openid});
        if (!itemObj){
            if (shareid){
                itemObj = await this.addUser(obj);
                await this.changeUserInfo(
                    {credit: Sequelize.literal(`'credit'+100`)},
                    {id: shareid}
                )
            }else{
                itemObj = await this.addUser(obj);
            }
        }
        return await this.createToken(itemObj.id);
        // for (const key in item)
        //     itemObj[key] = item[key];
        // return await itemObj.save();
    }

}
