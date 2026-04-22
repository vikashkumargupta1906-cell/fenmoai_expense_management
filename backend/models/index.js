const { Sequelize } = require('sequelize');
const config = require('../configs/config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.Expense = require('./expense')(sequelize, Sequelize.DataTypes);

module.exports = db;
