import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get('/latest/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const data = await Models.Data.findOne({
        where: { device_id: deviceId },
        order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(data);
})

router.get('/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const data = await Models.Data.findAll({
        where: { device_id: deviceId }
    });
    return res.status(200).json(data);
});

export default router;