import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

// fix
router.get('/:deviceId', async (req, res) => {
    try {
        const messages = await Models.Messages.findAll({
            where: { device_id: req.params.deviceId },
            order: [['createdAt', 'ASC']],
        });

        for(let message of messages) {
            const user = await Models.Users.findByPk(message.user_id);
            message.dataValues.username = user.username;
            message.dataValues.avatar = user.avatar ? user.avatar.toString('base64') : null;
        }

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// fix
router.post('/send', async (req, res) => {
    try {
        const { id } = req.user;
        const { device_id, message } = req.body;
        const newMessage = await Models.Messages.create({
            device_id,
            user_id: id,
            message
        });

        newMessage.dataValues.username = req.user.username;
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;