import { obtenerUsuarioPorId, agregarUsuario, actualizarUsuario } from "./datos.js";

const formulario = document.querySelector("form");
const mensaje = document.querySelector("#mensaje");
const botonGuardar = document.querySelector("#guardar-usuario");
const campos = ["nombre", "correo", "telefono", "rol", "estado"];
const id = new URLSearchParams(window.location.search).get("id");

async function cargarUsuario() {
    if (!id) return;
    const usuario = await obtenerUsuarioPorId(id);
    if (!usuario) {
        mensaje.textContent = "Usuario no encontrado.";
        botonGuardar.disabled = true;
        return;
    }
    for (const campo of campos) {
        formulario.elements[campo].value = usuario[campo] ?? "";
    }
    if (campos.some(campo => !usuario[campo])) {
        mensaje.textContent = "Completa los datos que faltan antes de guardar.";
    }
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(campos.map(campo => [campo, formulario.elements[campo].value.trim()]));
    if (campos.some(campo => !datos[campo])) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }
    if (id) {
        const usuario = await actualizarUsuario(id, datos);
        if (!usuario) {
            mensaje.textContent = "Usuario no encontrado.";
            return;
        }
    } else {
        await agregarUsuario(datos);
    }
    window.location.href = "usuarios.html";
});

cargarUsuario();
