const socket = io();

function updateProducts(products) {
	const ul = document.querySelector("ul");
	ul.innerHTML = "";

	products.forEach(product => {
		const li = document.createElement("li");
		li.textContent = product.title;
		li.className = "real-time-item";
		ul.appendChild(li);
	});
};


socket.on("products", (products) => {
	updateProducts(products);
});


let user;
let chatBox = document.querySelector(".input-text");


Swal.fire({
	title: "Bienvenido",
	text: "Por Favor, ingrese su Email",
	input: "text",
	inputValidator: (value) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!value.match(regex)) {
			return `Debe completar el campo con un Email valido.`;
		};
	},
	allowOutsideClick: false,
	allowEscapeKey: false,
}).then((result) => {
	user = result.value;
	socket.emit("user", { user, message: "Join the chat." });
});


chatBox.addEventListener("keypress", (e) => {
	if (e.key === "Enter" && chatBox.value.trim().length > 0) {
		socket.emit("message", { user, message: chatBox.value });
		chatBox.value = "";
	}
});

socket.on("messagesLogs", (data) => {
	let log = document.querySelector(".chat-message");
	let messages = "";
	data.forEach(message => {
		messages += `<p><strong>${message.user}</strong>: ${message.message}</p>`;
	});
	log.innerHTML = messages;
});