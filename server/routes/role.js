import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const roles = await Models.Roles.findAll();
        return res.status(200).json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;