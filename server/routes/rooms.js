import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const { id } = req.user;

        const rooms = await Models.Rooms.findAll({ where: { user_id: id } });
        return res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:roomId/devices', async (req, res) => {
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

export default router;