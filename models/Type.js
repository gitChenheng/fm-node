const db = require('../db');
const Sequelize = require('sequelize');
const key_value=require('./commons/common').key_value;

module.exports = db.defineModel('types', key_value);
