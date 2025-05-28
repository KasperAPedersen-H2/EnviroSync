import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Models from '../orm/models.js'; // Forbinder til dine ORM-modeller

const router = Router();

// POST-register rute: Registrer en bruger
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Tjek om alle nødvendige data er givet
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Tjek om brugeren allerede eksisterer
        const existingUser = await Models.User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        // Hash adgangskoden med bcryptjs
        const hashedPassword = bcrypt.hashSync(password, 10); // Salt-runde = 10

        // Opret den nye bruger
        const newUser = await Models.User.create({
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