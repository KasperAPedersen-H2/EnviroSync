import bcrypt from 'bcryptjs';
import Models from './models.js';

const Dummy = async () => {
    try {
        if (await Models.Users.count() > 0) return;

        const usersData = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
            { username: 'user3', password: 'password3' }
        ];

        const hashedUsersData = usersData.map(user => ({
            username: user.username,
            password: bcrypt.hashSync(user.password, 10)
        }));

        const users = await Models.Users.bulkCreate(hashedUsersData);
        console.log('Users added with hashed passwords!');

        const rooms = await Models.Rooms.bulkCreate([
            { user_id: users[0].id, name: 'Living Room' },
            { user_id: users[1].id, name: 'Bedroom' },
            { user_id: users[2].id, name: 'Kitchen' }
        ]);

        console.log('Rooms added!');

        const devices = await Models.Devices.bulkCreate([
            { room_id: rooms[0].id, name: 'Thermostat' },
            { room_id: rooms[1].id, name: 'Light Sensor' },
            { room_id: rooms[2].id, name: 'Humidifier' }
        ]);

        console.log('Devices added!');

        await Models.Data.bulkCreate([
            { device_id: devices[0].id, temperature: 22.5, humidity: 45, pressure: 1013, tvoc: 150 },
            { device_id: devices[1].id, temperature: 19.0, humidity: 55, pressure: 1015, tvoc: 185 },
            { device_id: devices[2].id, temperature: 25.0, humidity: 60, pressure: 1012, tvoc: 200 }
        ]);

        console.log('Sensor data added!');

        await Models.Messages.bulkCreate([
            { user_id: users[0].id, device_id: devices[0].id, text: 'Temperature is high in the Living Room.', createdAt: new Date() },
            { user_id: users[1].id, device_id: devices[1].id, text: 'Light levels are normal in the Bedroom.', createdAt: new Date() },
            { user_id: users[2].id, device_id: devices[2].id, text: 'Humidity is optimal in the Kitchen.', createdAt: new Date() },
            { user_id: users[0].id, device_id: devices[0].id, text: 'Pressure levels are stable.', createdAt: new Date() },
            { user_id: users[1].id, device_id: devices[1].id, text: 'TVOC levels are slightly above average.', createdAt: new Date() }
        ]);

        console.log('Messages added!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

export default Dummy;