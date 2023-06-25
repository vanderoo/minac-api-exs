//Libs
import { Sequelize } from 'sequelize';

class Database {
    constructor(server) {
        this.server = server;
    }

    async connect() {
        console.log('Connecting to the database...');
        try {
            this.db = new Sequelize({
                database: this.server.env.DATABASE,
                username: this.server.env.DB_USERNAME,
                password: this.server.env.DB_PASSWORD,
                host: this.server.env.DB_HOST,
                port: this.server.env.DB_PORT,
                dialect: 'mysql',
            });

            await this.db.authenticate();
            console.log('Connection has been established successfully.');
        } catch (err) {
            console.log(`Unable to connect to the database, error: ${err.message}`);
            return -1;
        }

        return this.db;
    }
}

export default Database;
