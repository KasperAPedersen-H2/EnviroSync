import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Data = sequelize.define('data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sensors',
            key: 'id'
        }
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    pressure: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tvoc: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    tableName: 'data',
    timestamps: true,
    updatedAt: false
});

export default Data;