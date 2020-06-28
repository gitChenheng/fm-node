const db = require('../db');
const Sequelize = require('sequelize');

module.exports = db.defineModel('participate', {
    uId:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    infoId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
});
