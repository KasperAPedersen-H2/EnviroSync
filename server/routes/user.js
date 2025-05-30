import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await Models.User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/update', async (req, res) => {
    console.log(req.body);
    res.end();
});

export default router;