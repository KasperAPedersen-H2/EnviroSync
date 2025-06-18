import sequelize from './database.js';
import Users from './models/users.js';
import Rooms from './models/rooms.js';
import Devices from './models/devices.js';
import Data from './models/data.js';
import Messages from './models/messages.js';
import Sensors from './models/sensors.js';
import Roles from './models/roles.js';
import UserRooms from "./models/userRooms.js";

export default {
    sequelize,
    Roles,
    Users,
    Sensors,
    Rooms,
    UserRooms,
    Devices,
    Data,
    Messages
};