express = require("express")
path = require("path")
http = require("http")
socketio = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", (socket) => {
    socket.emit('message', 'welcome to chat app!')
    socket.on("clientMessage", msg => {
        io.emit("message", msg)
    })
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(3000, () => console.log('start server'))
