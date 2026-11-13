import { obtenerIncidentePorId, eliminarIncidente } from "./datos.js";
import "./navegacion.js";

const detalle = document.querySelector("#detalle-incidente");
const id = new URLSearchParams(window.location.search).get("id");

async function mostrarDetalle() {
    const incidente = await obtenerIncidentePorId(id);
    if (!incidente) {
        detalle.textContent = "Incidente no encontrado.";
        return;
    }
    const campos = { descripcion: "Descripción", latitud: "Latitud", longitud: "Longitud", prioridad: "Prioridad", estado: "Estado", usuarioId: "ID del usuario", tipoIncidenteId: "ID del tipo de incidente" };
    const tarjeta = document.createElement("div");
    tarjeta.className = "detalle";
    for (const [campo, etiqueta] of Object.entries(campos)) {
        const linea = document.createElement("p");
        linea.textContent = `${etiqueta}: ${incidente[campo] ?? "No registrado"}`;
        tarjeta.appendChild(linea);
    }
    const enlace = document.createElement("a");
    enlace.href = `incidente-formulario.html?id=${encodeURIComponent(incidente.id)}`;
    enlace.textContent = "Editar incidente";
    tarjeta.appendChild(enlace);
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "boton-eliminar";
    botonEliminar.textContent = "Eliminar incidente";
    botonEliminar.addEventListener("click", async () => {
        if (!window.confirm("¿Eliminar este incidente de este navegador?")) return;
        botonEliminar.disabled = true;
        try {
            const eliminado = await eliminarIncidente(incidente.id);
            if (!eliminado) {
                detalle.textContent = "Incidente no encontrado.";
                return;
            }
            window.location.href = "incidentes.html?resultado=eliminado";
        } catch {
            botonEliminar.disabled = false;
            error.textContent = "No se pudo eliminar el incidente. Inténtalo de nuevo.";
        }
    });
    tarjeta.appendChild(botonEliminar);
    const error = document.createElement("p");
    error.setAttribute("role", "alert");
    tarjeta.appendChild(error);
    detalle.appendChild(tarjeta);
}

mostrarDetalle().catch(() => { detalle.textContent = "No se pudo cargar el incidente."; });
