import { api } from './api.js';

const formulario = document.querySelector('#form-registro');
const mensaje = document.querySelector('#mensaje-registro');
const boton = formulario.querySelector('button[type="submit"]');

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    datos.name = datos.name.trim();
    datos.email = datos.email.trim();
    if (!datos.name) { mensaje.textContent = 'Escribe un nombre válido.'; return; }
    mensaje.textContent = '';
    boton.disabled = true;
    boton.textContent = 'Creando cuenta...';
    try {
        await api.post('/api/auth/registro', datos);
        formulario.reset();
        mensaje.textContent = 'Cuenta creada. Ya puedes iniciar sesión.';
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        boton.disabled = false;
        boton.textContent = 'Crear cuenta';
    }
});
