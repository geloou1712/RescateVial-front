import { obtenerUnidadPorId } from "./datos.js";
import "./navegacion.js";

async function mostrarUnidad() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    const unidad = await obtenerUnidadPorId(id);

    if (!unidad) {
        document.querySelector("#mensaje-error").hidden = false;
        return;
    }

    document.querySelector("#datos-unidad").hidden = false;
    document.querySelector("#codigo-unidad").textContent = unidad.codigo_unidad;
    document.querySelector("#tipo-unidad").textContent = unidad.tipo_unidad;
    document.querySelector("#placas-unidad").textContent = unidad.placas;
    document.querySelector("#marca-modelo").textContent =
        `${unidad.marca} ${unidad.modelo}`;
    document.querySelector("#capacidad-unidad").textContent = unidad.capacidad;
    document.querySelector("#ubicacion-unidad").textContent =
        unidad.ubicacion_actual;
    document.querySelector("#disponibilidad-unidad").textContent =
        unidad.disponibilidad;
    document.querySelector("#estado-unidad").textContent = unidad.estado;

    document.querySelector("#enlace-editar").href =
        `unidad-formulario.html?id=${encodeURIComponent(unidad.id)}`;
}

mostrarUnidad().catch(error => {
    console.error("Error al cargar el detalle:", error);
    const mensaje = document.querySelector("#mensaje-error");
    mensaje.textContent = "Ocurrió un error al cargar la unidad.";
    mensaje.hidden = false;
});