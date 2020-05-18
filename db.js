const Sequelize = require('sequelize');
const config=require('./config/config-default');
const util=require('./utils/util');

var sequelize = new Sequelize(config.database, config.username, config.password , {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    timezone: '+08:00', //东八时区
});

sequelize.defineModel=function (name, attributes,options) {
    let attrs = {};
    attrs.id = {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        // unique: true, //该值为字符串时会寻找其他相同字符串字段建立联合索引
    };
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.createdAt = {
        type: Sequelize.DATE,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.DATE,
        allowNull: false
    };
    attrs.deletedAt = {
        type: Sequelize.DATE,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.isDeleted = {
        type: Sequelize.INTEGER,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        // indexes:[
        //     {
        //         name: 'tableName_unique_index',
        //         unique: true,
        //         method: 'BTREE',
        //         fields: ['name']
        //     },
        // ],//索引
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if(!obj.id&&options&&options.idFlag)obj.id = util.generateId(5);
                if(!obj.createdAt)obj.createdAt = now;
                if(!obj.updatedAt)obj.updatedAt = now;
                if(!obj.deletedAt)obj.deletedAt = new Date('9999');
                if(!obj.version)obj.version = 0;
                if(!obj.isDeleted)obj.isDeleted = 0;


                // if (obj.isNewRecord) {
                //     if (!obj.id&&options&&options.idFlag) obj.id = util.generateId(5);
                //     obj.createdAt = now;
                //     obj.updatedAt = now;
                //     obj.version = 0;
                //     obj.isDeleted = 0;
                // } else {
                //     obj.updatedAt = Date.now();
                //     obj.version++;
                // }
            }
        }
    });
};

module.exports=sequelize;
