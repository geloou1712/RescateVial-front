const CLAVE = 'sesion';

export function guardarSesion(token, usuario) {
    if (typeof token !== 'string' || !token.trim() ||
        typeof usuario?.name !== 'string' || !usuario.name.trim() ||
        typeof usuario?.role !== 'string' || !usuario.role.trim()) {
        throw new Error('El servidor no devolvió una sesión válida.');
    }
    localStorage.setItem(CLAVE, JSON.stringify({ token, usuario }));
}

function leerSesion() {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return null;
    try {
        const sesion = JSON.parse(texto);
        if (typeof sesion?.token === 'string' && sesion.token.trim() &&
            typeof sesion.usuario?.name === 'string' && sesion.usuario.name.trim() &&
            typeof sesion.usuario?.role === 'string' && sesion.usuario.role.trim()) {
            return sesion;
        }
    } catch {
        // Una sesión dañada se trata como una sesión ausente.
    }
    localStorage.removeItem(CLAVE);
    return null;
}

export function obtenerToken() {
    return leerSesion()?.token ?? null;
}

export function obtenerUsuario() {
    return leerSesion()?.usuario ?? null;
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE);
    location.replace('login.html');
}
