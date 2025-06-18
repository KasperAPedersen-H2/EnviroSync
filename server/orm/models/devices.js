import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Devices = sequelize.define('devices', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sensors',
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