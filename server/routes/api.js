import { Router } from "express";
import Models from "../orm/models.js";

const router = Router();

router.post('/api/data', async (req, res) => {
    console.log('Raw body:', req.body);
    res.end();
})

export default router;