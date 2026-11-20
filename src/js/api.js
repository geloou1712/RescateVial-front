const API_URL = (import.meta.env.VITE_API_URL || 'https://fakeapi-l9ei.onrender.com').replace(/\/$/, '');

export async function post(ruta, datos) {
    let respuesta;
    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } catch {
        throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.');
    }
    const contenido = await respuesta.json().catch(() => null);
    if (!respuesta.ok) throw new Error(contenido?.message || `No se pudo completar la solicitud (error ${respuesta.status}).`);
    return contenido;
}
