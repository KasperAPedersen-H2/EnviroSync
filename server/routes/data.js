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

    const [result] = await sequelize.query(`
        SELECT
            rooms.id AS room_id,
            rooms.name AS room_name,
            ROUND(AVG(latest_data.temperature)) AS avg_temperature,
            ROUND(AVG(latest_data.humidity)) AS avg_humidity,
            ROUND(AVG(latest_data.pressure)) AS avg_pressure,
            ROUND(AVG(latest_data.tvoc)) AS avg_co2 
        FROM rooms
                 JOIN devices ON rooms.id = devices.room_id
                 JOIN sensors ON devices.sensor_id = sensors.id
                 JOIN (
            SELECT d1.*
            FROM data d1
                     JOIN (
                SELECT sensor_id, MAX(createdAt) AS max_time
                FROM data
                GROUP BY sensor_id
            ) d2 ON d1.sensor_id = d2.sensor_id AND d1.createdAt = d2.max_time
        ) AS latest_data ON sensors.id = latest_data.sensor_id
        WHERE rooms.id = :roomId
        GROUP BY rooms.id, rooms.name;
        `,{
        replacements: { roomId: roomId },
        type: sequelize.QueryTypes.SELECT
    });

    console.log(result);
})

// Get all data from sensor
router.get('/:sensorId', async (req, res) => {
    const { sensorId } = req.params;

    const data = await Models.Data.findAll({
        where: { sensor_id: sensorId }
    })

    return res.status(200).json(data);
});

router.get('/avg/:roomId', async (req, res) => {
    const { roomId } = req.params;

    const [result] = await sequelize.query(`
        SELECT
            rooms.id AS room_id,
            rooms.name AS room_name,
            DATE_FORMAT(DATE_SUB(data.createdAt, INTERVAL MINUTE(data.createdAt) % 5 MINUTE), '%Y-%m-%d %H:%i:00') AS time_block,
            ROUND(AVG(data.temperature)) AS avg_temperature,
            ROUND(AVG(data.humidity)) AS avg_humidity,
            ROUND(AVG(data.pressure)) AS avg_pressure,
            ROUND(AVG(data.tvoc)) AS avg_co2
        FROM rooms
                 JOIN devices ON rooms.id = devices.room_id
                 JOIN sensors ON devices.sensor_id = sensors.id
                 JOIN data ON sensors.id = data.sensor_id
        WHERE rooms.id = roomId
        GROUP BY rooms.id, rooms.name, time_block
        ORDER BY time_block DESC;
        `,{
        replacements: { roomId: roomId },
        type: sequelize.QueryTypes.SELECT
    });

    console.log(result);
})

export default router;