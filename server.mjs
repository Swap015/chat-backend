
// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
    'http://localhost:5173',
    'https://chat-frontend-8lft.vercel.app'
];



const app = express();
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
}));

const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Listen for client connections
io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    // When a message is sent from the client
    socket.on('send_message', (data) => {
        console.log('📨 Message received:', data);
        io.emit('receive_message', data); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
