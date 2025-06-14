import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Models from '../orm/models.js';

const router = Router();

router.post('/', async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: "Username must be between 3 and 20 characters" });
        }

        const existingUser = await Models.Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const existingEmail = await Models.Users.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        switch (password){
            case passwordConfirm:
                break;
            default:
                return res.status(400).json({ message: "Passwords do not match" });
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