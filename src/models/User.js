//Libs
import {DataTypes} from 'sequelize';

class User {
    constructor(server) {
        this.table = server.model.db.define('User', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull:false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.TEXT,
            },
            refreshToken: {
              type: DataTypes.TEXT,
            },
        });
        //server.model.db.sync();
    }
}

export default User;
