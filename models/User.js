const db = require('../db');
const Sequelize = require('sequelize');

module.exports = db.defineModel('users', {
    id:{
        type: Sequelize.STRING(100),
        primaryKey: true,
    },
  	shareid:{
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    openid:{
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    role:{
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    name:{
        type:Sequelize.STRING(100),
        allowNull: false
    },
    avatarUrl:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    city:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    province:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    country:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    language:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    phone:{
        type:Sequelize.STRING(20),
        // unique:true,
        allowNull: true
    },
    pwd: {
        type:Sequelize.STRING(200),
        allowNull: true
    },
    gender: {
        type:Sequelize.BOOLEAN,
        allowNull: true
    },
    credit:{//积分
        type:Sequelize.BIGINT,
        allowNull: true
    },
    balance:{//余额
        type: Sequelize.DECIMAL(20,2),//总长，小数点右边长度
        allowNull: true
    },
    lastSignInTime:{//最近签到时间
        type: Sequelize.DATE,
        allowNull: true
    },
    address:{
        type:Sequelize.TEXT,
        allowNull: true
    },
},{
    idFlag:true,
});
