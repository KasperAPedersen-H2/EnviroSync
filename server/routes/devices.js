import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const devices = await Models.Devices.findAll();
        return res.status(200).json(devices);
    } catch (error) {
        console.error("Error fetching all devices:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:roomId", async (req, res) => {
    const { roomId } = req.params;

    try {
        const devices = await Models.Devices.findAll({
            where: { room_id: roomId },
        });

        if (!devices.length) {
            return res.status(404).json({ message: "No devices found for this room" });
        }

        return res.status(200).json(devices);
    } catch (error) {
        console.error("Error fetching devices for room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { name, room_id, serial_number } = req.body;

    if (!name || !room_id || !serial_number) {
        return res.status(400).json({ message: "Device name, room_id, and serial_number are required" });
    }

    try {
        const newDevice = await Models.Devices.create({ name, room_id, serial_number });
        return res.status(201).json(newDevice);
    } catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

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
        console.error("Error updating device:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

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
        console.error("Error deleting device:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;