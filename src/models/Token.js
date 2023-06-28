//Libs
import {DataTypes} from "sequelize";

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
        });
    }
}

export default Token;