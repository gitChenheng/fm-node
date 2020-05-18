const Sequelize = require('sequelize');

const key_value={
    // key: {
    //     type:Sequelize.INTEGER,
    //     autoIncrement:true,
    //     primaryKey:true,
    //     allowNull: false
    // },
    name: {
        type:Sequelize.STRING(100),
        allowNull: false
    },
};

module.exports={
    key_value,
};
