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

// when a new connection is received
io.on('connection', (socket) => {
  let userId = socket.id;
  // step 1. Listen to event where user emits her name, update users object
  // step 2. After updating users object, broadcast event to update everyone else with new user list
  // step 3. After updating users object, emit to new user with userList and message list
  // step 4. Listen to event when user emits new message. Broadcast to everyone else with new message
  // step 5. Listen to event when user disconnects. Delete user and Broadcast new user list to everyone
});

// replace with your server port
server.listen(3613);
