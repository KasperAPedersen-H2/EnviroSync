import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.post('/data', async (req, res) => {
    let { sn, temp, humidity, pressure, tvoc} = req.body;
    if (!sn ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (isNaN(temp) || isNaN(humidity) || isNaN(pressure) || isNaN(tvoc)) {
        return res.status(400).json({ message: 'Invalid data' });
    }
    let checkSN = await Models.Devices.findOne({where : {serial_number: sn}})
    if (!checkSN) {
        if(sn.length !== 6) {
            return res.status(400).json({ message: 'Invalid serial number' });
        }
        await Models.Devices.create({serial_number: sn, room_id: 1, name: 'New Device'})
    }

    await Models.Data.create({device_id: sn, temperature: temp, humidity: humidity, pressure: pressure, tvoc: tvoc})
    res.end();
})

export default router;