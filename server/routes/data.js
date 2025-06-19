import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

// Get newest data from sensor
router.get('/latest/:sensorId', async (req, res) => {
    const { sensorId } = req.params;

    const data = await Models.Data.findOne({
        where: { sensor_id: sensorId },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    return res.status(200).json(data);
})

router.get('/latest/avg/:roomId', async (req, res) => {
    const { roomId } = req.params;

    const data = await Models.Data.findAll({
        where: { room_id: roomId },
        order: [
            ['createdAt', 'DESC']
        ]
    });
})

// Get all data from sensor
router.get('/:sensorId', async (req, res) => {
    const { sensorId } = req.params;

    const data = await Models.Data.findAll({
        where: { sensor_id: sensorId }
    })

    return res.status(200).json(data);
});

export default router;