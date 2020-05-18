const db = require('../db');
const Sequelize = require('sequelize');
const key_value=require('./commons/common').key_value;

module.exports = db.defineModel('platforms', {
    ...key_value,
    platformImgUrl:{//平台图片链接
        type: Sequelize.STRING(100),
        allowNull: true
    },
});
