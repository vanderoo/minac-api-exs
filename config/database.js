const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')
dotenv.config()

// Database Connection Configuration
const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

module.exports = sequelize;
