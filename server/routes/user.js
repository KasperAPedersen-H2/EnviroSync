import { Router } from "express";
import Models from "../orm/models.js";
import multer from 'multer';
import sharp from 'sharp';

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
            attributes: [ 'id', 'username', 'avatar' ]
        });
        if (!user) {
            return res.status(404).json({ message: "User data not found" });
        }

        const userData = {
            username: user.username,
            avatar: user.avatar ? user.avatar.toString('base64') : null
        };


        return res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Avatar upload route
router.put('/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Resize og optimer billedet
        const optimizedImageBuffer = await sharp(req.file.buffer)
            .resize(200, 200, {
                fit: 'cover',
                withoutEnlargement: true
            })
            .png()
            .toBuffer();

        // Gem i databasen
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
    const { username, email } = req.body;

    try {
        const user = await Models.Users.findOne({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ message: "User data not found" });
        }

        await user.update({
            username: username || user.username,
            email: email || user.email
        });

        const updatedUserData = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return res.status(200).json(updatedUserData);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;