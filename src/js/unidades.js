import { obtenerUnidades } from "./datos.js";
import "./navegacion.js";

const cuerpoTabla = document.querySelector("#lista-unidades");
const mensajeVacio = document.querySelector("#mensaje-vacio");

async function mostrarUnidades() {
    const unidades = await obtenerUnidades();

    if (unidades.length === 0) {
        mensajeVacio.hidden = false;
        return;
    }

    mensajeVacio.hidden = true;
    cuerpoTabla.replaceChildren();

    unidades.forEach(unidad => {
        const fila = document.createElement("tr");

        const valores = [
            unidad.codigo_unidad,
            unidad.tipo_unidad,
            unidad.ubicacion_actual,
            unidad.disponibilidad,
            unidad.estado
        ];

        valores.forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaDetalle = document.createElement("td");
        const enlaceDetalle = document.createElement("a");

        enlaceDetalle.href =
            `unidad-detalle.html?id=${encodeURIComponent(unidad.id)}`;
        enlaceDetalle.textContent = "Ver detalle";

        celdaDetalle.appendChild(enlaceDetalle);
        fila.appendChild(celdaDetalle);
        cuerpoTabla.appendChild(fila);
    });
}

mostrarUnidades();