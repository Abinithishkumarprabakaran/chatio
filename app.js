import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const app = express();

const PORT = process.env.port || 4000;

const server = app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

const io = new Server(server)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection', onConnected)

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    // console.log('Socket disconnected', socket.id);
    socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);
  })

  socket.on('message', (data) => {
    // console.log(data);
    socket.broadcast.emit('chat-message', data);
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  })
}