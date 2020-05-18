const db = require('../db');
const Sequelize = require('sequelize');

module.exports = db.defineModel('signs', {
    uid: {
        type:Sequelize.STRING(50),
        allowNull: false,
    },
    name:{
        type:Sequelize.STRING(100),
        allowNull: false,
    },
    address:{//签到地点
        type:Sequelize.TEXT,
        allowNull: true,
    },
});
