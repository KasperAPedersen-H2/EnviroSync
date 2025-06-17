import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Sensors = sequelize.define('sensors', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'sensors',
    timestamps: false
});

export default Sensors;