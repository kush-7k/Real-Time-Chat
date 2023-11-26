const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from URl
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
   outputRoomName(room);
   outputUsers(users);
});

// message from server
socket.on('message', (message) => {
   // console.log(message);
   outputMessage(message);

   // scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // het message text
   const msg = e.target.elements.msg.value;

   // emit message to server
   socket.emit('chatMessage', msg);

   // clear input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

// output msg to DOM
function outputMessage(message) {
   const div = document.createElement('div');
   div.classList.add('message');
 
   // Check if the message is from the current user or others
   const isCurrentUser = message.username === username;
    // Add additional class based on the sender
    if (message.username === username) {
      div.classList.add('right'); // Sender's message on the right
      div.classList.add('bubble');
    } else {
      div.classList.add('left'); // Other user's message on the left
      div.classList.add('bubble');
    }
 
   // Add the appropriate sender class to the message div

 
   div.innerHTML = `
     <p class="meta">${message.username} <span>${message.time}</span></p>
     <p class="text">
       ${message.text}
     </p>
   `;
 
   document.querySelector('.chat-messages').appendChild(div);
 }
 
// add room name to DOM
function outputRoomName(room) {
   roomName.innerHTML = room;
}

// add users to DOM
function outputUsers(users) {
   userList.innerHTML = `
      ${users.map((user) => `<li>${user.username}</li>`).join('')}
   `;
}
