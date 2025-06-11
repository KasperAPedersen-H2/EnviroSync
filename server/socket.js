import { Server } from 'socket.io';

let io;

const socket = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io is not initialized');
        }

        return io;
    }
};

export default socket;