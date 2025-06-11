import sequelize from './database.js';
import Users from './models/users.js';
import Rooms from './models/rooms.js';
import Devices from './models/devices.js';
import Data from './models/data.js';
import Messages from './models/messages.js';

export default {
    sequelize,
    Users,
    Rooms,
    Devices,
    Data,
    Messages
};