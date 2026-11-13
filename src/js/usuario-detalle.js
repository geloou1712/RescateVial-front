import { obtenerUsuarioPorId } from "./datos.js";

const detalle = document.querySelector("#detalle-usuario");
const id = new URLSearchParams(window.location.search).get("id");

async function mostrarDetalle() {
    const usuario = await obtenerUsuarioPorId(id);
    if (!usuario) {
        detalle.textContent = "Usuario no encontrado";
        return;
    }
    const campos = { nombre: "Nombre", correo: "Correo", telefono: "Teléfono", rol: "Rol", estado: "Estado" };
    for (const [campo, etiqueta] of Object.entries(campos)) {
        const linea = document.createElement("p");
        linea.textContent = `${etiqueta}: ${usuario[campo] || "No registrado"}`;
        detalle.appendChild(linea);
    }
    const enlaceEditar = document.createElement("a");
    enlaceEditar.textContent = "Editar";
    enlaceEditar.href = `usuario-formulario.html?id=${usuario.id}`;
    detalle.appendChild(enlaceEditar);
}

mostrarDetalle().catch(function () {
    detalle.textContent = "No se pudo cargar el usuario.";
});
