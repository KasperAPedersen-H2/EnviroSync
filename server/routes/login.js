import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Tilføj JWT
import Models from '../orm/models.js'; // Forbinder til dine ORM-modeller

const router = Router();

// JWT Secret Key (du kan flytte dette til en .env-fil for bedre sikkerhed)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Tjek om alle nødvendige data er angivet
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find bruger i databasen
        const user = await Models.User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }

        // Valider adgangskode
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generér JWT-token
        const token = jwt.sign(
            { id: user.id, username: user.username }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // Token gyldig i 1 time
        );

        // Returner login-succes med token
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;