import express from 'express';
import { createServer } from 'https';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Add a test route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// SSL certificate configuration
const options = {
    key: fs.readFileSync(path.join(__dirname, 'localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'localhost+2.pem'))
};

const server = createServer(options, app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    transports: ['polling', 'websocket'],
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false
});

// Add detailed logging
io.engine.on("connection_error", (err) => {
    console.log('Server connection error:', {
        code: err.code,
        message: err.message,
        type: err.type
    });
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', ({ roomId, userName }) => {
        console.log(`User ${userName} joining room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('send-message', ({ message, roomId }) => {
        socket.to(roomId).emit('message', message);
        console.log(`Message sent to room ${roomId}:`, message);
    });

    socket.on('offer', ({ signal, room }) => {
        socket.to(room).emit('offer', { signal, from: socket.id });
        console.log(`Offer sent to room ${room}`);
    });

    socket.on('answer', ({ signal, room }) => {
        socket.to(room).emit('answer', { signal, from: socket.id });
        console.log(`Answer sent to room ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on https://192.168.11.12:${PORT}`);
    console.log('CORS origins:', ["http://localhost:3000", "https://localhost:3000", "https://192.168.11.12:3000"]);
});