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

// Get all users of specific room
router.get("/:roomId/users", async (req, res) => {
    try {
        const { roomId } = req.params;

        const users = await Models.UserRooms.findAll({ where: { room_id: roomId } });
        for(let user of users) {
            const foundUser = await Models.Users.findOne({
                where: { id: user.user_id },
                attributes: ['id', 'username']
            });
            user.dataValues.username = foundUser.username;
        }

        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Add a user to a specific room
router.post("/:roomId/add-user", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { username } = req.body;

        const user = await Models.Users.findOne({ where: { username } }); // Find user by username
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingAssociation = await Models.UserRooms.findOne({
            where: { room_id: roomId, user_id: user.id }
        });

        if (existingAssociation) {
            return res.status(400).json({ message: "User is already added to the room" });
        }

        const newUserRoom = await Models.UserRooms.create({
            room_id: roomId,
            user_id: user.id
        });

        return res.status(201).json({
            id: newUserRoom.id,
            user_id: user.id,
            username: user.username
        });
    } catch (error) {
        console.error("Error adding user to the room:", error);
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
        const newRoom = await Models.Rooms.create({ name });
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
    console.log(roomId);
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

// Remove user from specific room
router.delete("/:roomId/remove-user", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { user_id } = req.body;

        const userRoomAssociation = await Models.UserRooms.findOne({
            where: { room_id: roomId, user_id },
        });

        if (!userRoomAssociation) {
            return res.status(404).json({ message: "User not found in this room" });
        }

        await userRoomAssociation.destroy();
        return res.status(200).json({ message: "User removed from the room" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router;