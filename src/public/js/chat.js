

const socket = io ();
let user;
let chatBox = document.querySelector (".input-text");


Swal.fire ({
    title: "Bienvenido",
    text: "Por favor ingrese su Email",
    input: "text",
    inputValidator: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
        if (!value.match (regex)){
            return `Usted debe completar el campo con un Email valido.`;
        };
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result) => {
    user = result.value;
    socket.emit ("user", {user, message: "Ingrese al chat."});


});


socket.on ("messagesLogs", (data) => {
    let log = document.querySelector(".chat-message");
    let messages = "";
    data.forEach(message =>{
        messages += `<p><strong>${message.user}</strong>: ${message.message}</p>`;
    } );
    log.innerHTML = messages;
});

chatBox.addEventListener("keypress", (e)=>{
    if (e.key === "Enter" && chatBox.value.trim().length>0){
        socket.emit("message", {user, message: chatBox.value});
        chatBox.value = "";
    }
});
