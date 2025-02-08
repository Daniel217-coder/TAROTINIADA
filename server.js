const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" })); 
app.use(express.static(__dirname));

const io = socketIo(server, {
  cors: {
    origin: "*", // Or specify a specific origin like "http://localhost:3000/"
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('new-added', (msg) => {
        
        io.emit('add-to-chat', msg); 
    });

    socket.on('disconnect', () => { });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => { });