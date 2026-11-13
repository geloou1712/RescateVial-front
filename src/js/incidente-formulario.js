import { obtenerIncidentePorId, agregarIncidente, actualizarIncidente } from "./datos.js";
import "./navegacion.js";

const formulario = document.querySelector("#formulario-incidente");
const mensaje = document.querySelector("#mensaje");
const boton = formulario.querySelector('button[type="submit"]');
const id = new URLSearchParams(window.location.search).get("id");
const campos = ["descripcion", "latitud", "longitud", "prioridad", "estado", "usuarioId", "tipoIncidenteId"];

formulario.addEventListener("invalid", evento => {
    const etiqueta = formulario.querySelector(`label[for="${evento.target.id}"]`);
    mensaje.textContent = `Revisa el campo ${etiqueta ? etiqueta.textContent : "indicado"}: ${evento.target.validationMessage}`;
}, true);

async function prepararFormulario() {
    if (!id) return;
    boton.disabled = true;
    const incidente = await obtenerIncidentePorId(id);
    if (!incidente) {
        mensaje.textContent = "Incidente no encontrado.";
        return;
    }
    document.querySelector("#titulo-formulario").textContent = "Editar incidente";
    for (const campo of campos) formulario.elements[campo].value = incidente[campo] ?? "";
    boton.disabled = false;
}

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();
    const datos = Object.fromEntries(campos.map(campo => [campo, formulario.elements[campo].value.trim()]));
    if (campos.some(campo => !datos[campo])) {
        mensaje.textContent = "Completa todos los campos.";
        return;
    }
    for (const campo of ["latitud", "longitud", "usuarioId", "tipoIncidenteId"]) datos[campo] = Number(datos[campo]);
    if (!Number.isFinite(datos.latitud) || !Number.isFinite(datos.longitud) || Math.abs(datos.latitud) > 90 || Math.abs(datos.longitud) > 180 || !Number.isSafeInteger(datos.usuarioId) || datos.usuarioId < 1 || !Number.isSafeInteger(datos.tipoIncidenteId) || datos.tipoIncidenteId < 1) {
        mensaje.textContent = "Revisa las coordenadas y los identificadores.";
        return;
    }
    boton.disabled = true;
    try {
        if (id) {
            const incidente = await actualizarIncidente(id, datos);
            if (!incidente) { mensaje.textContent = "Incidente no encontrado."; return; }
        } else {
            await agregarIncidente(datos);
        }
        window.location.href = "incidentes.html?resultado=guardado";
    } catch {
        mensaje.textContent = "No se pudo guardar el incidente.";
        boton.disabled = false;
    }
});

prepararFormulario().catch(() => {
    mensaje.textContent = "No se pudo cargar el incidente.";
    boton.disabled = true;
});
