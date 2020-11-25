const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const {generateMessage} = require('./utils/message.js')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

io.on("connection", (socket) => {

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id: socket.id, ...options})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("chat app", user.username+ ", welcome!"))
        //emit to all connected client except the current one
        socket.broadcast.to(user.room).emit('message', generateMessage("chat app",`${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on("clientMessage", (message, callback) => {
        const user = getUser(socket.id)
        //emit to all connected clients
        io.to(user.room).emit("message", generateMessage(user.username, message))
        callback("ack!")
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage("chat app", `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('start server'))
