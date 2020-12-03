import Info from "@/model/entity/Info";
import {dbCtx} from "@/server/db/db_context";
import {Sequelize} from "sequelize-typescript";

export default class InfoDao {

    static async getById (id): Promise<Info> {
        return await Info.findOne({raw: true, where: {id}})
    }

    static async getInCondition(condition){
        return await Info.findOne({
            raw: true,
            where: condition
        });
    }

    static async queryAllInCondition(item){
        const {reviewStatus, typeid, platformid, pageIndex, pageSize} = item;
        const search = item.search ? `%${item.search}%` : `%%`;
        const db = dbCtx();
        return await db.query(
            `SELECT
            i.id,i.name,i.initiator,i.price,i.review_status AS reviewStatus,i.level,
            i.typeid,i.platformid,i.start_at AS startAt,i.end_at AS endAt,i.uid,i.credit,
            i.anonymous,i.free,i.reject_reason AS rejectReason,i.details,i.created_at AS createdAt,
            p.platform_img_url AS platformImgUrl
            from info i
            LEFT JOIN platform p
            ON i.platformid=p.id
            WHERE i.review_status=:reviewStatus
            and i.typeid${typeid ? `=:typeid` : ` IS NOT NULL`}
            and i.platformid${platformid ? `=:platformid` : ` IS NOT NULL`}
            and i.name like :search
            and i.deleted_at IS NULL
            ORDER BY i.created_at DESC
            LIMIT :offset,:pageSize;
            `,
            {
                type: db.QueryTypes.SELECT,
                plain: false,
                raw: true,
                replacements: {
                    typeid,
                    platformid,
                    reviewStatus,
                    search,
                    offset: (Number(pageIndex) - 1) * Number(pageSize),
                    pageSize
                }
            })
    }

    static async getAllInCondition(item): Promise<any>{
        const {typeid, platformid, pageIndex, pageSize} = item;
        const now = Date.now();
        const Op = Sequelize.Op;
        const criteria = {
            reviewStatus: item.reviewStatus ? item.reviewStatus : 0, //审核状态 0默认 1通过 2驳回
            endAt: {[Op.gt]: now}, //大于gt，小于lt
        } as any;
        if (item.search){
            criteria.name = {
                [Op.like]: `%${item.search}%`
            }
        }
        if (typeid){
            criteria.typeid = typeid
        }
        if (platformid){
            criteria.platformid = platformid
        }
        if (item.level){
            criteria.level = item.level;
        }else{
            // criteria.level = {[Op.lte]: 3};
        }
        return await Info.findAll({
            where: criteria,
            order: [
                ['created_at', 'DESC']
            ],
            offset: (Number(pageIndex) - 1) * Number(pageSize),
            limit: pageSize,
        })
    }

    static async getAllItems(){
        return await Info.findAll();
    }

    static async updateItemById(item, id){
        await this.updateItemInCondition(item, {id})
    }

    static async updateItemInCondition(item, condition){
        return await Info.update(
            item,
            {where: condition}
        )
    }

    static async createItem(item){
        return await Info.create(item);
    }

    static async destroyItem(id){
        return await Info.destroy({
            where: {id}
        });
    }

}
