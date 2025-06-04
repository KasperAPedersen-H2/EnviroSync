import Express from 'express';
import DotEnv from 'dotenv';
import cors from 'cors';

import authenticateToken from "./middleware/auth.js";
import loginRoute from './routes/login.js'
import registerRoute from './routes/register.js'
import userRoute from './routes/user.js';
import apiRoute from './routes/api.js';

const app = new Express();
DotEnv.config();

app.use(cors());

app.use(Express.json());

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/user", authenticateToken, userRoute);
app.use("/api", apiRoute);

app.listen(5000, (e) => console.log(e ? e : 'Server started'));