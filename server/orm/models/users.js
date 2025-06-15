import {DataTypes} from 'sequelize';
import sequelize from '../database.js';

let Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default Users;