import bcrypt from 'bcryptjs';
import Models from './models.js';

const Dummy = async () => {
    try {
        if (await Models.Users.count() > 0) return;

        const rolesData = [
            { name: 'User' },
            { name: 'Admin' }
        ];

        await Models.Roles.bulkCreate(rolesData);
        console.log('Roles added!');

        const usersData = [
            { role_id: 2, username: 'user1', email:'user1@dummy.dk', password: 'password1' },
            { role_id: 1, username: 'user2', email:'user2@dummy.dk', password: 'password2' },
            { role_id: 1, username: 'user3', email:'user3@dummy.dk', password: 'password3' }
        ];

        const hashedUsersData = usersData.map(user => ({
            role_id: user.role_id,
            username: user.username,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10)
        }));

        await Models.Users.bulkCreate(hashedUsersData);
        console.log('Users added with hashed passwords!');

        await Models.Rooms.bulkCreate([
            { name: 'Meeting Room' },
            { name: 'office' },
        ]);

        await Models.UserRooms.bulkCreate([
            { user_id: 1, room_id: 1 },
            { user_id: 2, room_id: 1 },
            { user_id: 3, room_id: 1 },
            { user_id: 1, room_id: 2 },
            { user_id: 3, room_id: 2 },
        ]);

        await Models.Sensors.bulkCreate([
            { serial_number: '123456' },
            { serial_number: '654321' },
        ]);

        await Models.Devices.bulkCreate([
            { room_id: 1, sensor_id: 1, name: 'sensor1' },
            { room_id: 2, sensor_id: 2, name: 'sensor2' },
        ]);

        await Models.Data.bulkCreate([
            { sensor_id: 1, temperature: 22, humidity: 48, pressure: 1012, tvoc: 180 },
            { sensor_id: 1, temperature: 23, humidity: 47, pressure: 1013, tvoc: 190 },
            { sensor_id: 1, temperature: 24, humidity: 49, pressure: 1014, tvoc: 175 },
            { sensor_id: 1, temperature: 25, humidity: 51, pressure: 1015, tvoc: 210 },
            { sensor_id: 1, temperature: 23, humidity: 50, pressure: 1011, tvoc: 195 },
            { sensor_id: 1, temperature: 22, humidity: 52, pressure: 1016, tvoc: 170 },
            { sensor_id: 1, temperature: 24, humidity: 46, pressure: 1017, tvoc: 185 },
            { sensor_id: 1, temperature: 23, humidity: 48, pressure: 1013, tvoc: 200 },
            { sensor_id: 1, temperature: 24, humidity: 50, pressure: 1018, tvoc: 190 },
            { sensor_id: 1, temperature: 25, humidity: 47, pressure: 1019, tvoc: 205 },
            { sensor_id: 1, temperature: 23, humidity: 49, pressure: 1020, tvoc: 180 },
            { sensor_id: 1, temperature: 24, humidity: 51, pressure: 1021, tvoc: 195 },
            { sensor_id: 1, temperature: 22, humidity: 53, pressure: 1022, tvoc: 185 },
            { sensor_id: 1, temperature: 23, humidity: 48, pressure: 1023, tvoc: 175 },
            { sensor_id: 1, temperature: 24, humidity: 46, pressure: 1024, tvoc: 200 },
            { sensor_id: 1, temperature: 25, humidity: 50, pressure: 1025, tvoc: 210 },
            { sensor_id: 1, temperature: 23, humidity: 52, pressure: 1026, tvoc: 195 },
            { sensor_id: 1, temperature: 22, humidity: 49, pressure: 1027, tvoc: 185 },
            { sensor_id: 1, temperature: 24, humidity: 47, pressure: 1028, tvoc: 190 },
            { sensor_id: 1, temperature: 25, humidity: 48, pressure: 1029, tvoc: 200 },
            { sensor_id: 2, temperature: 21, humidity: 47, pressure: 1010, tvoc: 165 },
            { sensor_id: 2, temperature: 22, humidity: 49, pressure: 1011, tvoc: 175 },
            { sensor_id: 2, temperature: 23, humidity: 50, pressure: 1012, tvoc: 160 },
            { sensor_id: 2, temperature: 24, humidity: 46, pressure: 1013, tvoc: 185 },
            { sensor_id: 2, temperature: 22, humidity: 48, pressure: 1014, tvoc: 170 },
            { sensor_id: 2, temperature: 23, humidity: 51, pressure: 1015, tvoc: 180 },
            { sensor_id: 2, temperature: 21, humidity: 45, pressure: 1016, tvoc: 155 },
            { sensor_id: 2, temperature: 24, humidity: 49, pressure: 1017, tvoc: 190 },
            { sensor_id: 2, temperature: 23, humidity: 47, pressure: 1018, tvoc: 165 },
            { sensor_id: 2, temperature: 22, humidity: 50, pressure: 1019, tvoc: 175 },
            { sensor_id: 2, temperature: 23, humidity: 52, pressure: 1020, tvoc: 185 },
            { sensor_id: 2, temperature: 21, humidity: 46, pressure: 1021, tvoc: 160 },
            { sensor_id: 2, temperature: 24, humidity: 48, pressure: 1022, tvoc: 170 },
            { sensor_id: 2, temperature: 22, humidity: 49, pressure: 1023, tvoc: 180 },
            { sensor_id: 2, temperature: 23, humidity: 47, pressure: 1024, tvoc: 165 },
            { sensor_id: 2, temperature: 24, humidity: 51, pressure: 1025, tvoc: 190 },
            { sensor_id: 2, temperature: 22, humidity: 46, pressure: 1026, tvoc: 155 },
            { sensor_id: 2, temperature: 23, humidity: 50, pressure: 1027, tvoc: 175 },
            { sensor_id: 2, temperature: 21, humidity: 48, pressure: 1028, tvoc: 160 },
            { sensor_id: 2, temperature: 24, humidity: 49, pressure: 1029, tvoc: 185 },
        ]);

        await Models.Messages.bulkCreate([
            { room_id: 1, user_id: 1, message: 'Hello, how are you?' },
            { room_id: 1, user_id: 2, message: 'I am fine, thank you!' },
            { room_id: 1, user_id: 3, message: 'Nice to meet you!' },
            { room_id: 2, user_id: 1, message: 'Hello, how are you?' },
            { room_id: 2, user_id: 3, message: 'I am fine, thank you!' },
        ])

        console.log('Rooms added!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

export default Dummy;