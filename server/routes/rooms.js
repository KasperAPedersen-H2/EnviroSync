import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const { id } = req.user;

        const rooms = await Models.Rooms.findAll({ where: { user_id: id } });
        return res.status(200).json(rooms);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:roomId/devices", async (req, res) => {
    const { roomId } = req.params;

    try {
        const devices = await Models.Devices.findAll({
            where: { room_id: roomId }
        });

        if (!devices.length) {
            return res.status(404).json({ message: "No devices found for this room" });
        }

        return res.status(200).json(devices);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Room name is required" });
    }

    try {
        const { id: user_id } = req.user;
        const newRoom = await Models.Rooms.create({ name, user_id });
        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:roomId", async (req, res) => {
    const { roomId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Room name is required" });
    }

    try {
        const room = await Models.Rooms.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.name = name;
        await room.save();

        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:roomId", async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await Models.Rooms.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.destroy();

        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;