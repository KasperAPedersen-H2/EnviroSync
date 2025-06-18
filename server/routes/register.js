import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Models from '../orm/models.js';
import { fn, col, where, Op } from 'sequelize';
import { validateRegistration } from '../utils/validation.js';

const router = Router();

router.post('/', async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    try {
        const errorMessages = validateRegistration({
            username,
            email,
            password,
            passwordConfirm
        });

        if (errorMessages) {
            return res.status(400).json({ message: errorMessages });
        }

        const existingUser = await Models.Users.findOne({
            where: {
                [Op.or]: [
                    where(fn('lower', col('username')), fn('lower', username)),
                    where(fn('lower', col('email')), fn('lower', email))
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await Models.Users.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User registered successfully", user: newUser.username });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;