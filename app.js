const express = require('express');
const app = express();

// server has app object
const server = require('http').Server(app);

const sio = require('socket.io');

// sio will set up everything, including send js
const io = sio(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('hello');
});

const users = {};
const messages = [];

io.on('connection', (socket) => {
  let userId = socket.id;
  socket.on('presence', (data) => {
    if(!data.name) return;
    users[socket.id] = data;
    socket.emit('data', {users, messages});
    socket.broadcast.emit('users', users);
  });
  socket.on('message', (d) => {
    const message = {userId, message: d.message};
    messages.push(message);
    socket.broadcast.emit('message', message );
  });
  socket.on('disconnect', () => {
    delete users[userId];
    io.emit('users', users);
  });
});

server.listen(3613);
