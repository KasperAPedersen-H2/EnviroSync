import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

// Get all devices assigned to the specific room_id
router.get("/:roomId", async (req, res) => {
    const { roomId } = req.params;

    try {
        const devices = await Models.Devices.findAll({
            where: { room_id: roomId },
        });

        if (!devices || devices.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(devices);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Create new device
router.post("/new", async (req, res) => {
    const { name, room_id, serial_number } = req.body;

    if (!name || !room_id || !serial_number) {
        return res.status(400).json({ message: "Device name, room_id, and serial_number are required" });
    }

    try {
        const sensor = await Models.Sensors.findOne({ where: { serial_number } });
        if(!sensor) {
            return res.status(409).json({ message: "Couldnt find sensor" });
        }

        const newDevice = await Models.Devices.create({
            room_id,
            sensor_id: sensor.id,
            name
        });

        return res.status(201).json(newDevice);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update device
router.put("/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    const { name, room_id } = req.body;

    if (!name || !room_id) {
        return res.status(400).json({ message: "Device name and room_id are required" });
    }

    try {
        const device = await Models.Devices.findByPk(deviceId);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        device.name = name;
        device.room_id = room_id;
        await device.save();

        return res.status(200).json(device);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Delete device
router.delete("/:deviceId", async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Models.Devices.findByPk(deviceId);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        await device.destroy();

        return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;