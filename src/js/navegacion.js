import navegacionHtml from '../partials/navegacion.html?raw';
import { cerrarSesion } from './sesion.js';

export function mostrarNavegacion(usuario) {
    const contenedorNav = document.querySelector('#site-nav');
    if (!contenedorNav) return;
    contenedorNav.innerHTML = navegacionHtml;
    document.querySelector('#nombre-usuario').textContent = usuario.name;
    document.querySelector('#avatar-usuario').textContent = usuario.name.trim().split(/\s+/)
        .slice(0, 2).map(palabra => palabra[0]).join('').toUpperCase();
    document.querySelector('#cerrar-sesion').addEventListener('click', evento => {
        evento.preventDefault();
        cerrarSesion();
    });
}
