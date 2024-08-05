const Sequelize = require('sequelize');
const dbconfig = require('../config/database.js');
const Class = require('./class.js');
const User = require('./user.js');

const connection = new Sequelize(dbconfig);

Class.init(connection);
User.init(connection);


module.exports = connection;