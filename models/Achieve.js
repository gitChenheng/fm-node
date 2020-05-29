const db = require('../db');
const Sequelize = require('sequelize');
const key_value=require('./commons/common').key_value;

module.exports = db.defineModel('achieves', {
    ...key_value,
    point:{//成就点数
        type: Sequelize.INTEGER,
        allowNull: true
    },
    conditions:{//达成条件
        type: Sequelize.TEXT,
        allowNull: true
    },
});
