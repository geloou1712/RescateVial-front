import { obtenerUsuario, cerrarSesion } from './sesion.js';
import { puedeEntrar } from './permisos.js';
import { mostrarNavegacion } from './navegacion.js';

const usuario = obtenerUsuario();
if (!usuario) {
    document.body.hidden = true;
    location.replace('login.html');
    throw new Error('Sin sesión');
}

const paginaActual = location.pathname.split('/').pop().replace(/\.html$/, '');
if (!puedeEntrar(paginaActual, usuario.role)) {
    document.body.hidden = true;
    location.replace('home.html');
    throw new Error('Sin permiso para esta página');
}

mostrarNavegacion(usuario);

// También revisa las tarjetas y los enlaces del contenido de la página.
for (const enlace of document.querySelectorAll('a[href]')) {
    const url = new URL(enlace.getAttribute('href'), location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html')) continue;
    const pagina = url.pathname.split('/').pop().replace(/\.html$/, '');
    if (!puedeEntrar(pagina, usuario.role)) enlace.remove();
}

const seccion = document.body.dataset.seccion;
const enlaceActivo = document.querySelector('.main-nav a[data-seccion="' + seccion + '"]');
if (enlaceActivo) {
    enlaceActivo.classList.add('activo');
    enlaceActivo.setAttribute('aria-current', 'page');
}

// Revisa de nuevo al restaurar una página desde el historial del navegador.
window.addEventListener('pageshow', evento => {
    if (!evento.persisted) return;
    const actual = obtenerUsuario();
    if (!actual) cerrarSesion();
    else location.reload();
});
