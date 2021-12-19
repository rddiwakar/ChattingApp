
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io")
const formatMessages = require("./utils/messages")
const { getJoinUser, getCurrentUser, userLeave, getRoomUsers } = require("./utils/user")

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botname = 'chatCode boat'

//when user connected
io.on("connection", socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = getJoinUser(socket.id, username, room)
        socket.join(user.room)

        //welcome current user
        socket.emit('message', formatMessages(botname, "welcome to chatchord"));

        //broadcast when user connected
        socket.broadcast.to(user.room).emit('message', formatMessages(botname, `a ${user.username} join team`))

        //send room user info
        io.to(user.room).emit('room', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // listen on chatmessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.emit('message', formatMessages(user.username, msg))
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessages(botname, `${user.username} disconnected`))
            io.to(user.room).emit('room', {
                room: user.room,
                users: getRoomUsers(user.room)
            })  
        }
        //send room user info
        
    });
});

const PORT = 3000 || process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')))
server.listen(PORT, () => console.log(`server connected on ${PORT}`))