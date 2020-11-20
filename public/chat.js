const $messageInput = document.getElementById("message")
const $sendBtn = document.getElementById("sendBtn")
const $messages = document.querySelector('#messages')
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML

let socket = io()
socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.message,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    $messages.scrollTop = $messages.scrollHeight;
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
