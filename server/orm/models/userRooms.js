import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let UserRooms = sequelize.define('user_rooms', {
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
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id'
        }
    }
}, {
    tableName: 'user_rooms',
    timestamps: false
});

export default UserRooms;