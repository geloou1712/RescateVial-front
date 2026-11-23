import './main.js';
import { api } from './api.js';

const mensaje = document.querySelector('#mensaje-home');

async function cargarPerfil() {
    try {
        const yo = await api.get('/api/auth/yo');
        if (typeof yo?.name !== 'string' || !yo.name.trim()) {
            throw new Error('El servidor no devolvió un perfil válido.');
        }
        document.querySelector('#saludo-nombre').textContent = yo.name.trim().split(/\s+/)[0];
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.hidden = false;
    }
}

cargarPerfil().catch(() => {
    if (mensaje) {
        mensaje.textContent = 'No se pudo cargar el perfil.';
        mensaje.hidden = false;
    }
});
