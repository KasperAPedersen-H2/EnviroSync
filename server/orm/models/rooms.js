import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Rooms = sequelize.define('rooms', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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