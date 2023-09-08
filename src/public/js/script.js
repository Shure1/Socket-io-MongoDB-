const socket = io();

const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");
const valMessage = document.getElementById("chatBox");
const valEmail = document.getElementById("emailBox");

botonChat.addEventListener("click", () => {
  if (valMessage.value.trim().length > 0) {
    socket.emit("mensaje", {
      mensaje: valMessage.value,
      email: valEmail.value,
    });
    valMessage.value = "";
    valEmail.value = "";
  }
});

socket.on("mensajeGuardado", (respuesta) => {
  const { success, mensaje } = respuesta;
  if (success) {
    console.log(mensaje);
  } else {
    console.log(mensaje);
  }
});
