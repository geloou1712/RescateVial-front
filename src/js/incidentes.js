import { obtenerIncidentes } from "./datos.js";
import "./navegacion.js";

const lista = document.querySelector("#lista-incidentes");
const mensaje = document.querySelector("#mensaje-vacio");
const mensajeAccion = document.querySelector("#mensaje-accion");
const accion = new URLSearchParams(window.location.search).get("resultado");
if (accion === "guardado" || accion === "eliminado") {
    mensajeAccion.textContent = accion === "guardado" ? "Incidente guardado en este navegador." : "Incidente eliminado de este navegador.";
    mensajeAccion.hidden = false;
}

async function mostrarIncidentes() {
    const incidentes = await obtenerIncidentes();
    lista.replaceChildren();
    mensaje.hidden = incidentes.length !== 0;
    for (const incidente of incidentes) {
        const fila = document.createElement("tr");
        for (const valor of [incidente.descripcion, `${incidente.latitud}, ${incidente.longitud}`, incidente.prioridad, incidente.estado]) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        }
        const celda = document.createElement("td");
        const enlace = document.createElement("a");
        enlace.href = `incidente-detalle.html?id=${encodeURIComponent(incidente.id)}`;
        enlace.textContent = "Ver detalle";
        celda.appendChild(enlace);
        fila.appendChild(celda);
        lista.appendChild(fila);
    }
}

mostrarIncidentes().catch(() => {
    mensaje.textContent = "No se pudieron cargar los incidentes.";
    mensaje.hidden = false;
});
