const socket = io.connect('http://songjs.llip.life/');

let name = prompt('what is your username?');
socket.on('connect', () => {
  socket.emit('presence', { name });
});

let users = {};
socket.on('data', (data) => {
  users = data.users;
  renderUsers(data.users);
  renderMessages(data.messages);
});

socket.on('users', (data) => {
  users = data;
  renderUsers(data);
});

socket.on('message', ({userId, message}) => {
  if(!users[userId]) return;
  createMessage({name: users[userId].name, message});
});

const chatContainer = document.getElementsByClassName('chatContainer')[0];

const renderUsers = (users) => {
  const userListContainer = document.getElementById('userListContainer');
  userListContainer.innerHTML = Object.values(users).reduce((acc, user) => {
    return `${acc} <div> ${user.name} </div>`;
  }, '');
};


/* 
 * HELPER functions for rendering UI
*/
const renderMessages = (messages) => {
  chatContainer.innerHTML = '';
  messages.forEach( ({userId, message}) => {
    const u = users[userId] || {name: "Anon"};
    createMessage({name: u.name, message});
  });
  chats.scrollTop = chats.scrollHeight;
};

const createMessage = ({name, message}) => {
  const ct = document.createElement('div');
  ct.className = 'chat';
  ct.innerHTML = `
<span class="user">${name}: </span>
<span class="message">${message}</span>
  `;
  chatContainer.appendChild(ct);
  chats.scrollTop = chats.scrollHeight;
};

const submit = (v) => {
  if(!name) return;
  socket.emit('message', { message: v });
  createMessage({name, message: v});
};

input.focus();
input.onkeyup = (e) => {
  if(e.keyCode === 13) {
    const v = e.target.value;
    submit(v);
    input.value = '';
  };
};

