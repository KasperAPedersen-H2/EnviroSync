import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.post('/data', async (req, res) => {
    console.log('Raw body:', req.body);
    let { sn, temp, humidity, pressure, tvoc} = req.body;
    if (!sn || !temp || !humidity || !pressure || !tvoc) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    await Models.Data.create({device_id: sn, temperature: temp, humidity: humidity, pressure: pressure, tvoc: tvoc})
    res.end();
})

export default router;