const db = require('../db');
const Sequelize = require('sequelize');

module.exports = db.defineModel('infos', {
    name: {//奖品名
        type:Sequelize.STRING(100),
        allowNull: false
    },
    initiator: {//金主
        type:Sequelize.STRING(300),
        allowNull: true
    },
    price:{//价值
        type: Sequelize.DECIMAL(10,2),//总长，小数点右边长度
        allowNull: true
    },
    reviewStatus:{//审核状态 0默认 1通过 2驳回
        type: Sequelize.INTEGER,
        allowNull: false
    },
    level:{//活动星级
        type: Sequelize.INTEGER,
        allowNull: true
    },
    typeId:{//类别id
        type: Sequelize.STRING(50),
        allowNull: true
    },
    type:{//类别名
        type: Sequelize.STRING(100),
        allowNull: true
    },
    platformId:{//平台id
        type: Sequelize.STRING(50),
        allowNull: true
    },
    platform:{//平台名称
        type: Sequelize.STRING(100),
        allowNull: true
    },
    platformImgUrl:{//平台图片链接
        type: Sequelize.TEXT,
        allowNull: true
    },
    methodId:{//参与方式id
        type: Sequelize.STRING(50),
        allowNull: true
    },
    method:{//参与方式
        type: Sequelize.STRING(100),
        allowNull: true
    },
    startTime:{
        type: Sequelize.DATE,
        allowNull: true
    },
    endTime:{
        type: Sequelize.DATE,
        allowNull: true
    },
    authorId:{//创建者id
        type: Sequelize.STRING(50),
        allowNull: true
    },
    author:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    credit:{//积分
        type:Sequelize.BIGINT,
        allowNull: true
    },
    anonymous:{//是否匿名
        type:Sequelize.BOOLEAN,
        allowNull: true
    },
    free:{//是否免费参与
        type:Sequelize.BOOLEAN,
        allowNull: true
    },
    rejectReason:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    details:{
        type: Sequelize.TEXT,
        allowNull: true
    },
});
