import UserDao from "@/service/dao/UserDao";
import {_compare, _hash} from "@/utils/hash";
import {sign} from "@/utils/helper/middleware";
import Sequelize from "sequelize";
import {setRedisData, getRedisData} from "@/service/common/redisSer";
import {JWT_SECRET} from "@/constans/global";
import jwt from "jsonwebtoken";
import BaseService from "@/service/BaseService";
import JSONResult from "@/utils/JSONResult";

export default class UserService extends BaseService{

    static async getuid(ctx){
        const token = ctx.request.header.token;
        const decodeToken = await getRedisData('token');
        if (decodeToken){
            return JSON.parse(decodeToken).uid
        }else{
            return await jwt.verify(token, JWT_SECRET, null, async (err, decoded) => {//此处解密为异步
                if (err){
                    ctx.type = "application/json";
                    ctx.status = JSONResult.unauthorized().status;
                    ctx.body = JSONResult.unauthorized().body
                }else{
                    return decoded.uid
                }
            });
        }
    }

    static async getRole(ctx){
        const uid = await this.getuid(ctx);
        const userInfo = await UserDao.getById(uid);
        return userInfo.role
    }

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
    }

}
