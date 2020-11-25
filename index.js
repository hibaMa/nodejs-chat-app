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

    // emit to the newly connected client
    socket.emit('message', generateMessage("welcome to chat app!"))

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id: socket.id, ...options})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage(user.username))
        //emit to all connected client except the current one
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        callback()
    })

    socket.on("clientMessage", (message, callback) => {
        const user = getUser(socket.id)
        //emit to all connected clients
        io.to(user.room).emit("message", generateMessage(message))
        callback("ack!")
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
        }
    })
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('start server'))
