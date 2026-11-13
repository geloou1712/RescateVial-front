import {
    agregarUnidad,
    actualizarUnidad,
    obtenerUnidadPorId
} from "./datos.js";
import "./navegacion.js";

const formulario = document.querySelector("#formulario-unidad");
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function prepararFormulario() {
    if (!id) return;

    const unidad = await obtenerUnidadPorId(id);

    if (!unidad) {
        window.location.href = "unidades.html";
        return;
    }

    document.querySelector("#titulo-formulario").textContent = "Editar unidad";

    Object.entries(unidad).forEach(([campo, valor]) => {
        const elemento = formulario.elements.namedItem(campo);

        if (elemento) {
            elemento.value = valor;
        }
    });
}

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const datos = Object.fromEntries(new FormData(formulario));

    if (id) {
        await actualizarUnidad(id, datos);
        window.location.href = `unidad-detalle.html?id=${encodeURIComponent(id)}`;
    } else {
        await agregarUnidad(datos);
        window.location.href = "unidades.html";
    }
});

prepararFormulario();