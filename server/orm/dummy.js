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
            { username: 'user1', email:'user1@dummy.dk', password: 'password1' },
            { username: 'user2', email:'user2@dummy.dk', password: 'password2' },
            { username: 'user3', email:'user3@dummy.dk', password: 'password3' }
        ];

        const hashedUsersData = usersData.map(user => ({
            username: user.username,
            email: user.email,
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
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

export default Dummy;