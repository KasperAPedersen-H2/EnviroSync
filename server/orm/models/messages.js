import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Messages = sequelize.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    device_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'devices',
            key: 'serial_number'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'messages',
    timestamps: true
});

export default Messages;