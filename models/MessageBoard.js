const db = require('../db');
const Sequelize = require('sequelize');

module.exports = db.defineModel('messageBoard', {
    pId:{
        type: Sequelize.STRING(50),
        allowNull: true
    },
    content: {
        type:Sequelize.TEXT,
        allowNull: false
    },
    createdUid:{
        type: Sequelize.STRING(50),
        allowNull: false
    },
    createdName:{
        type: Sequelize.STRING(100),
        allowNull: false
    },
    avatarUrl:{
        type: Sequelize.TEXT,
        allowNull: true
    },
});
