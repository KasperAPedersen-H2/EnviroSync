import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Models from '../orm/models.js';

const router = Router();

router.post('/', async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    try {
        let errorMessages = "";
        //chack data
        if (!username || !email || !password || !passwordConfirm) {errorMessages = "Username, email and password are required."}
        //Username chack
        else if (username.length < 3 || username.length > 20) {errorMessages = "Username must be between 3 and 20 characters."}
        else if (username.match(/[^a-zA-Z0-9]/)) {errorMessages = "Username must not contain special characters."}
        //Email chack
        else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {errorMessages = "Invalid email address."}
        //Password chack
        else if (password.length < 8) {errorMessages = "Password must be at least 8 characters long";}
        else if (password.length > 20) {errorMessages = "Password must be less than 20 characters long."}
        else if (password.match(/[0-9]/)) {errorMessages = "Password must contain at least one number."}
        else if (password.match(/[a-z]/)) {errorMessages = "Password must contain at least one uppercase letter."}
        else if (password.match(/[A-Z]/)) {errorMessages = "Password must contain at least one lowercase letter."}
        else if (password.match(/[^a-zA-Z0-9]/)) {errorMessages = "Password must contain at least one special character."}
        else if (password !== passwordConfirm) {errorMessages = "Passwords do not match."}

        if (errorMessages.length  > 0) {
            return res.status(400).json({ message: errorMessages });
        }

        const existingUser = await Models.Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: "Couldn't create user." });
        }

        const existingEmail = await Models.Users.findOne({ where: { email } });
        if (existingEmail) {
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