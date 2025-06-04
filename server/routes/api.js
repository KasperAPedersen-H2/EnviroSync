import { Router } from "express";

const router = Router();

router.post('/data', async (req, res) => {
    console.log('Raw body:', req.body);
    res.end();
})

export default router;