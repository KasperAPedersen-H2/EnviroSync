import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

// Get all rooms assigned  to user
router.get("/all", async (req, res) => {
    try {
        const { id } = req.user;

        const userRooms = await Models.UserRooms.findAll({ where: { user_id: id } });
        let allUserRooms = [];

        for(let room of userRooms) {
            const foundRoom = await Models.Rooms.findOne({ where: { id: room.room_id } });
            allUserRooms.push(foundRoom);
        }

        return res.status(200).json(allUserRooms);
    } catch(e) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Create new room
router.post("/new", async (req, res) => {
    const { id } = req.user;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Room name is required" });
    }

    try {
        const newRoom = await Models.Rooms.create({ name, user_id });
        const newUserRoom = await Models.UserRooms.create({ user_id: id, room_id: newRoom.id });
        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update room
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

// Delete room
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