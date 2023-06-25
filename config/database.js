import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Database Connection Configuration
const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
});

export default sequelize;
