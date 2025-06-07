import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get('/:roomId', async (req, res) => {
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