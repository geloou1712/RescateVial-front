import { post } from './api.js';

const formulario = document.querySelector('form');
const mensaje = document.querySelector('#mensaje-login');
const boton = formulario.querySelector('button[type="submit"]');

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    datos.email = datos.email.trim();
    mensaje.textContent = '';
    boton.disabled = true;
    boton.textContent = 'Entrando...';
    try {
        const respuesta = await post('/api/auth/login', datos);
        if (!respuesta?.token || !respuesta?.user) throw new Error('El servidor no devolvió una sesión válida.');
        localStorage.setItem('sesion', JSON.stringify({ token: respuesta.token, usuario: respuesta.user }));
        window.location.href = 'home.html';
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        boton.disabled = false;
        boton.textContent = 'Iniciar sesión';
    }
});
