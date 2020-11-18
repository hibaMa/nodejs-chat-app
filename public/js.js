socket = io()
socket.on("message", (msg) => {
    console.log("server say " + msg)
})

submitMessage = (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message")
    socket.emit("clientMessage", messageInput.value)
}
