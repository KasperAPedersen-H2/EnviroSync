import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Rooms = sequelize.define('rooms', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'rooms',
    timestamps: false
});

export default Rooms;