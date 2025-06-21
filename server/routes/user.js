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

router.get("/all", async (req, res) => {
    try {
        const users = await Models.Users.findAll({
            attributes: [ 'id', 'username', 'avatar', 'role_id', 'enabled' ],
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const formattedUsers = [];
        for (let user of users) {
            const role = await Models.Roles.findByPk(user.role_id);

            formattedUsers.push({
                id: user.id,
                username: user.username,
                avatar: user.avatar ? user.avatar.toString('base64') : null,
                role: role ? role.name : 'Unknown',
                enabled: user.enabled
            });
        }


        return res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
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

        const userData = {
            username: user.username,
            avatar: user.avatar ? user.avatar.toString('base64') : null,
            email: user.email
        };

        return res.status(200).json(userData);
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
    const { username, email, password, newPassword, confirmPassword, role_id } = req.body;

    try {
        const user = await Models.Users.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: "User data not found" });
        }

        const currentUser = await Models.Users.findOne({
            where: { id: req.user.id }
        });

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

        if (role_id && role_id !== user.role_id && currentUser.role_id === 2) {
            fieldsToUpdate.role_id = role_id;
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

router.put('/:id/enable', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Models.Users.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.enabled) {
            await Models.Users.update({ enabled: false }, { where: { id } });
            return res.status(200).json({ message: "User disnabled successfully" });
        } else {
            await Models.Users.update({ enabled: true }, { where: { id } });
            return res.status(200).json({ message: "User enabled successfully" });
        }
    } catch (error) {
        console.error("Error enabling user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

export default router;