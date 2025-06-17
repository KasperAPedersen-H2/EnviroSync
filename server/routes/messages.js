import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

// Get all messages for specific sensor
router.get('/:deviceId', async (req, res) => {
    try {
        console.log(req.params.deviceId);

        const { deviceId } = req.params;

        const device = await Models.Devices.findByPk(deviceId);
        if(!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const sensorId = device.sensor_id;

        const messages = await Models.Messages.findAll({
            where: { sensor_id: sensorId },
            order: [['createdAt', 'ASC']],
        })

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

// Create new message
router.post('/send', async (req, res) => {
    try {
        const { id } = req.user;
        const { device_id, message } = req.body;

        if(!device_id || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const device = await Models.Devices.findByPk(device_id);
        if(!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const sensorId = device.sensor_id;
        const newMessage = await Models.Messages.create({
            sensor_id: sensorId,
            user_id: id,
            message
        })

        newMessage.dataValues.username = req.user.username;
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;