import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Models from '../orm/models.js';

const router = Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const existingUser = await Models.Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await Models.Users.create({
            username,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User registered successfully", user: newUser.username });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;