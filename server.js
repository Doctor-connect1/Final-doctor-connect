import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://192.168.11.12:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002", "http://192.168.11.12:3000"],
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket']
    },
    allowEIO3: true
});

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join-room', ({ roomId, userName }) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
        console.log(`User ${userName} (${socket.id}) joined room ${roomId}`);
    });

    socket.on('send-message', ({ message, roomId }) => {
        socket.to(roomId).emit('message', message);
        console.log(`Message sent to room ${roomId}:`, 
            message.file ? `File: ${message.file.name}` : message.text
        );
    });

    socket.on('offer', ({ signal, room }) => {
        socket.to(room).emit('offer', { signal, from: socket.id });
        console.log(`Offer sent to room ${room} from ${socket.id}`);
    });

    socket.on('answer', ({ signal, room }) => {
        socket.to(room).emit('answer', { signal, from: socket.id });
        console.log(`Answer sent to room ${room} from ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});