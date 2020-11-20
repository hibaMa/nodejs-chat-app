const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const { generateMessage } = require('./utils/message.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {
    // emit to the newly connected client
    socket.emit('message', generateMessage("welcome to chat app!"))
    //emit to all connected client except the current one
    socket.broadcast.emit('message', 'a new user has joined!')
    socket.on("clientMessage", (message, callback) => {
        //emit to all connected clients
        io.emit("message", generateMessage(message))
        callback("ack!")
    })

    socket.on("disconnect", () => {
        io.emit("message", "a user has left!")
    })
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(3000, () => console.log('start server'))
