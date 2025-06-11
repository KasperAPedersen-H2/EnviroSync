import openSocket from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (!this.socket) {
            this.socket = openSocket("http://localhost:5000");
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.socket) {
            console.error("WebSocket not initialized");
            return;
        }
        this.socket.on(event, callback);
    }

    emit(event, data) {
        if (!this.socket) {
            console.error("WebSocket not initialized");
            return;
        }
        this.socket.emit(event, data);
    }
}

const socketService = new SocketService();
export default socketService;