import { Router } from "express";
import Models from "../orm/models.js";
import Socket from "../socket.js";

const router = Router();

// Get all messages for specific sensor
router.get('/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;

        const messages = await Models.Messages.findAll({
            where: { room_id: roomId },
            order: [['createdAt', 'ASC']]
        });

        for(let message of messages) {
            const user = await Models.Users.findByPk(message.user_id);
            message.dataValues.username = user.username;
            message.dataValues.avatar = user.avatar ? user.avatar.toString('base64') : null;
        }

        return res.status(200).json(messages);
    } catch(e) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new message
router.post('/send', async (req, res) => {
    try {
        const { id } = req.user;
        const { roomId, message } = req.body;

        if(!roomId || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const room = await Models.Rooms.findByPk(roomId);
        if(!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const newMessage = await Models.Messages.create({
            room_id: roomId,
            user_id: id,
            message
        });

        newMessage.dataValues.username = req.user.username;
        Socket.getIO().emit('new-message', { roomId: roomId, userId: id });
        res.status(201).json(newMessage);
    } catch(e) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;