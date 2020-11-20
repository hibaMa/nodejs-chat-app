(function(){
    const $messageInput = document.getElementById("message")
    const $sendBtn = document.getElementById("sendBtn")
    const $messages = document.querySelector('#messages')
    //templates
    const messageTemplate = document.querySelector('#message-template').innerHTML

    let socket = io()
    socket.on("message", (message) => {
        const html = Mustache.render(messageTemplate, {
            message: message,
        })
        $messages.insertAdjacentHTML('beforeend', html)
        $messages.scrollTop = $messages.scrollHeight;
    })

    sendMessage = (e) => {
        e.preventDefault();
        $sendBtn.setAttribute("disabled", "disabled")
        socket.emit("clientMessage", $messageInput.value, (msgFromServer) => {
            //fun called when i get ack from server - server received the message
            $sendBtn.removeAttribute("disabled")
            $messageInput.value = "";
        })
    }
})()