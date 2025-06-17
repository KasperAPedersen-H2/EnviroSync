import { Router } from "express";
import Models from "../orm/models.js";
import Socket from "../socket.js";

const router = Router();

// Register sensor
router.post('/register', async (req, res) => {
    try {
        const { serial_number } = req.body;

        await Models.Sensors.create({
            serial_number: serial_number
        });

        return res.status(200).json({ message: 'Success' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// Add new data from sensor
router.post('/data/new', async (req, res) => {
    try {
        const { serial_number, temp, humidity, pressure, tvoc } = req.body;
        if(!serial_number || !temp || !humidity || !pressure || !tvoc) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if(isNaN(temp) || isNaN(humidity) || isNaN(pressure) || isNaN(tvoc)) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        const sensor = await Models.Sensors.findOne({ where: { serial_number: serial_number } });
        if(!sensor) {
            return res.status(400).json({ message: 'Invalid serial number' });
        }

        const data = await Models.Data.create({
            sensor_id: sensor.id,
            temperature: temp,
            humidity: humidity,
            pressure: pressure,
            tvoc: tvoc
        });

        Socket.getIO().emit('new-data', { deviceId: data.sensor_id });
        res.status(200).end();
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
