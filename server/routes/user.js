import { Router } from "express";
import Models from "../orm/models.js";
import multer from 'multer';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import { validateUsername, validateEmail, validatePasswordChange } from "../utils/validation.js";

const router = Router();

const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Models.Users.findOne({
            where: { id },
            attributes: [ 'id', 'username', 'email', 'avatar' ]
        });
        if (!user) {
            return res.status(404).json({ message: "User data not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const optimizedImageBuffer = await sharp(req.file.buffer)
            .resize(200, 200, {
                fit: 'cover',
                withoutEnlargement: true
            })
            .png()
            .toBuffer();

        await Models.Users.update(
            { avatar: optimizedImageBuffer },
            { where: { id: req.params.id } }
        );

        res.status(200).json({ message: 'Avatar updated successfully' });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Error updating avatar' });
    }
});

router.put("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const { username, email, password, newPassword, confirmPassword } = req.body;

    try {
        const user = await Models.Users.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: "User data not found" });
        }

        const fieldsToUpdate = {};
        const errors = [];

        if (username && username !== user.username) {
            const usernameError = validateUsername(username);
            if (usernameError) {
                errors.push(usernameError);
            } else {
                fieldsToUpdate.username = username;
            }
        }

        if (email && email !== user.email) {
            const emailError = validateEmail(email);
            if (emailError) {
                errors.push(emailError);
            } else {
                fieldsToUpdate.email = email;
            }
        }

        if (newPassword) {
            if (!password) {
                errors.push("Current password is required to change the password.");
            } else if (!bcrypt.compareSync(password, user.password)) {
                errors.push("Current password is incorrect.");
            } else {
                const passwordError = validatePasswordChange({
                    newPassword,
                    confirmPassword
                });

                if (passwordError) {
                    errors.push(passwordError);
                } else {
                    fieldsToUpdate.password = bcrypt.hashSync(newPassword, 10);
                }
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(200).json({ message: "No changes were made" });
        }

        await user.update(fieldsToUpdate);

        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;