import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Messages = sequelize.define('messages', {
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
        },
        onDelete: 'CASCADE'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'messages',
    timestamps: true
});

export default Messages;