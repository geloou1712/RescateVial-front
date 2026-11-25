import { api } from './api.js';
import { guardarSesion, obtenerUsuario } from './sesion.js';

if (obtenerUsuario()) {
    location.replace('home.html');
} else {
    const formulario = document.querySelector('#form-login');
    const mensaje = document.querySelector('#mensaje-login');
    const boton = formulario.querySelector('button[type="submit"]');

    formulario.addEventListener('submit', async evento => {
        evento.preventDefault();
        const datos = Object.fromEntries(new FormData(formulario));
        datos.email = datos.email.trim();
        mensaje.textContent = '';
        mensaje.hidden = true;
        boton.disabled = true;
        boton.textContent = 'Entrando...';
        try {
            const respuesta = await api.post('/api/auth/login', datos);
            if (respuesta?.user?.role !== datos.role) {
                throw new Error('El rol seleccionado no coincide con el de tu cuenta.');
            }
            guardarSesion(respuesta.token, respuesta.user);
            location.href = 'home.html';
        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.hidden = false;
        } finally {
            boton.disabled = false;
            boton.textContent = 'Iniciar sesión';
        }
    });
}
