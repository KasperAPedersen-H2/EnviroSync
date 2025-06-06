import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/rooms", async (req, res) => {
    try {
        const { id } = req.user;

        const rooms = await Models.Rooms.findAll({ where: { user_id: id } });
        return res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/rooms/:roomId/devices', async (req, res) => {
    const { roomId } = req.params;

    try {
        const devices = await Models.Devices.findAll({
            where: { room_id: roomId }
        });

        if (!devices.length) {
            return res.status(404).json({ message: 'No devices found for this room' });
        }

        return res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching devices for room:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/data/latest/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const data = await Models.Data.findOne({
        where: { device_id: deviceId },
        order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(data);
})

router.get('/data/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const data = await Models.Data.findAll({
        where: { device_id: deviceId }
    });
    return res.status(200).json(data);
});

router.get('/messages/:deviceId', async (req, res) => {
    try {
        const messages = await Models.Messages.findAll({
            where: { device_id: req.params.deviceId },
            order: [['createdAt', 'ASC']],
        });

        for(let message of messages) {
            const user = await Models.Users.findByPk(message.user_id);
            message.dataValues.username = user.username;
        }

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

router.post('/messages', async (req, res) => {
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

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Models.Users.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;