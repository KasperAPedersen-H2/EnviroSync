import Express from 'express';
import DotEnv from 'dotenv';
import cors from 'cors';

import Socket from './socket.js';
import authenticateToken from "./middleware/auth.js";

import sensorRoute from './routes/sensor.js';
import loginRoute from './routes/login.js'
import registerRoute from './routes/register.js'
import userRoute from './routes/user.js';
import roomsRoute from './routes/rooms.js';
import messagesRoute from './routes/messages.js';
import dataRoute from './routes/data.js';
import devicesRoute from './routes/devices.js';
import roleRoute from './routes/role.js';

const app = new Express();
DotEnv.config();

const allowedDomains = process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : ['https://es.launchify.dk'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedDomains.some(domain => origin.startsWith(domain))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));



app.use(Express.json());

app.use('/sensor', sensorRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/user", authenticateToken, userRoute);
app.use("/room", authenticateToken, roomsRoute);
app.use("/message", authenticateToken, messagesRoute);
app.use("/data", authenticateToken, dataRoute);
app.use("/device", authenticateToken, devicesRoute);
app.use("/role", authenticateToken, roleRoute);

const server = app.listen(5000, (e) => {
    console.clear();
    if(e) {
        console.log(e);
        return;
    }

    Socket.init(server);
    console.log("Server started");
});