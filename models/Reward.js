const db = require('../db');
const Sequelize = require('sequelize');
const key_value=require('./commons/common').key_value;

module.exports = db.defineModel('rewards', {
    ...key_value,
    rewardImgUrl:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    needCredit:{//兑换所需积分
        type:Sequelize.BIGINT,
        allowNull: true
    },
    onShelf:{//是否上架
        type:Sequelize.BOOLEAN,
        allowNull: true
    },
    type:{//0.正常奖品 1.每月积分榜第一奖励 2.第二 3.第三 4.
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    details:{
        type: Sequelize.TEXT,
        allowNull: true
    },
});
