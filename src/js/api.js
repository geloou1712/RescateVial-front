import { obtenerToken, cerrarSesion } from './sesion.js';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const rutasPublicas = new Set(['/api/auth/login', '/api/auth/registro']);

async function request(method, ruta, datos) {
    const headers = {};
    if (datos !== undefined) headers['Content-Type'] = 'application/json';
    const token = obtenerToken();
    if (token && !rutasPublicas.has(ruta)) headers.Authorization = 'Bearer ' + token;
    let respuesta;
    try {
        respuesta = await fetch(API_URL + ruta, {
            method, headers, body: datos !== undefined ? JSON.stringify(datos) : undefined,
        });
    } catch {
        throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.');
    }
    if (respuesta.status === 401 && !rutasPublicas.has(ruta)) {
        cerrarSesion();
        throw new Error('Tu sesión expiró. Inicia sesión de nuevo.');
    }
    const contenido = await respuesta.json().catch(() => null);
    if (!respuesta.ok) throw new Error(contenido?.message ?? contenido?.mensaje ?? 'Error ' + respuesta.status);
    return contenido;
}

export const api = {
    get: ruta => request('GET', ruta),
    post: (ruta, datos) => request('POST', ruta, datos),
    put: (ruta, datos) => request('PUT', ruta, datos),
    delete: ruta => request('DELETE', ruta),
};
export const post = api.post;
