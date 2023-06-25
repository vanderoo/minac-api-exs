//Libs
import {DataTypes} from 'sequelize';

class User {
    constructor(server) {
        this.table = server.model.db.define('User', {
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        });
        console.log('user defined');
    }
}

export default User;
