express = require("express")
path = require("path")
http = require("http")
socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {
    // emit to the newly connected client
    socket.emit('message', 'welcome to chat app!')
    //emit to all connected client except the current one
    socket.broadcast.emit('message', 'a new user has joined!')
    socket.on("clientMessage", (msg, callback) => {
        //emit to all connected clients
        io.emit("message", msg)
        callback("ack!")
    })

    socket.on("disconnect", () => {
        io.emit("message", "a user has left!")
    })
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(3000, () => console.log('start server'))
