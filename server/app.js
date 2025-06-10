import Express from 'express';
import DotEnv from 'dotenv';
import cors from 'cors';

import authenticateToken from "./middleware/auth.js";
import loginRoute from './routes/login.js'
import registerRoute from './routes/register.js'
import userRoute from './routes/user.js';
import apiRoute from './routes/api.js';

import roomsRoute from './routes/rooms.js';
import messagesRoute from './routes/messages.js';
import dataRoute from './routes/data.js';
import devicesRoute from './routes/devices.js';

const app = new Express();
DotEnv.config();
console.log("my name is Jeff");
app.use(cors());

app.use(Express.json());

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/user", authenticateToken, userRoute);
app.use("/room", authenticateToken, roomsRoute);
app.use("/message", authenticateToken, messagesRoute);
app.use("/data", authenticateToken, dataRoute);
app.use("/device", authenticateToken, devicesRoute);
app.use("/api", apiRoute);

app.listen(5000, (e) => console.log(e ? e : 'Server started'));