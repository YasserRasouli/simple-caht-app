const socket = io('/');

const chatForm = document.getElementById('chat-form');
const roomNameH2 = document.getElementById('room-name');
const usersUl = document.getElementById('users');


socket.on('message', msg => {
    showMessage(msg);

});

console.log(USERNAME);
console.log(ROOM_ID);


socket.emit('join-room', {USERNAME , ROOM_ID});

socket.on('usersOfRoom', ({room, users}) => {
    showRoomName(room);
    showUserNames(users);
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputMsg = e.target.elements.msg.value;

    //send user's message to server
    socket.emit('chat-message', inputMsg );
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

const showMessage = message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
    `<p class="meta"> ${message.username} <span>${message.time}</span></p>
     <p class="text">${message.txt}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
};



const showRoomName = (room) => {
    roomNameH2.innerText = room;
};

const showUserNames = (users) => {
    usersUl.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};