

const roomName = document.getElementById('room-name')
const roomUsers = document.getElementById('users')
const chatform = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const socket = io();

//Get username and room
const params = () => {
    let obj = {}
    let arr = window.location.search.slice(1).split("&");
    arr.forEach(element => {
        const itm = element.split("=");
        obj[itm[0]] = itm[1]
        
    });
    return obj
}
const {username,room} = params()
//join chatroom

socket.emit('joinRoom',params())
socket.on('room',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})
socket.on('message', message =>{
    console.log(message)
    outputMessage(message)
    //scroll     
    chatMessages.scrollTop = chatMessages.scrollHeight
})
//message
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value;
   
    //emit message to server
    socket.emit('chatMessage', msg)
    // input empty
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})  

// // ouput message function
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class= "meta"> ${message.username} <span>${message.time}</span> </p>
        <p class="text" >${message.text}</p>
     `
    document.querySelector('.chat-messages').appendChild(div)
}
// Add roomName to dom

function outputRoomName(room){
    roomName.innerHTML= room
}
// Add roomName to dom

function outputUsers(users){ 
    roomUsers.innerHTML=`${users.map(user =>{
        return`<li>${user.username}</li>`
    }).join("")}`
}