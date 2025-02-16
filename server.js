import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling']
    },
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
});

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send-message', ({ message, room }) => {
        socket.to(room).emit('message', message);
    });

    socket.on('offer', ({ signal, room }) => {
        socket.to(room).emit('offer', signal);
    });

    socket.on('answer', ({ signal, room }) => {
        socket.to(room).emit('answer', signal);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});