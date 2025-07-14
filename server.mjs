


// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors()); // Allow cross-origin

const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // React frontend URL
        methods: ['GET', 'POST']
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

server.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
