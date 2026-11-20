import navegacionHtml from '../partials/navegacion.html?raw';

const contenedorNav = document.querySelector('#site-nav');

if (contenedorNav) {
  contenedorNav.innerHTML = navegacionHtml;
  document.querySelector('#cerrar-sesion')?.addEventListener('click', () => {
    localStorage.removeItem('sesion');
  });
}
