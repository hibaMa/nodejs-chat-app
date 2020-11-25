const $messageInput = document.getElementById("message")
const $sendBtn = document.getElementById("sendBtn")
const $messages = document.querySelector('#messages')
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//query string in path
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

let socket = io()
socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $messages.scrollTop = $messages.scrollHeight;
})

socket.on("roomData", ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

let sendMessage = (e) => {
    e.preventDefault();
    $sendBtn.setAttribute("disabled", "disabled")
    socket.emit("clientMessage", $messageInput.value, (msgFromServer) => {
        //fun called when i get ack from server - server received the message
        $sendBtn.removeAttribute("disabled")
        $messageInput.value = "";
    })
}

//callback is ack from server
socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

