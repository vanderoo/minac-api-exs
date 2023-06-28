//Libs
import {DataTypes} from "sequelize";


import User from "./User.js";

class Token {
    constructor(server) {
        this.table = server.model.db.define('Token', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            refreshToken: {
                type: DataTypes.TEXT,
                unique: true,
            },
            UserId: {
                type: DataTypes.UUID
            }
        });

        this.user = new User(server);
        this.userModel = this.user.table;

        this.userModel.hasMany(this.table);
        this.table.belongsTo(this.userModel);


        server.model.db.sync();

    }
}

export default Token;