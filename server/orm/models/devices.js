import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Devices = sequelize.define('devices', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'devices',
    timestamps: false
});

export default Devices;