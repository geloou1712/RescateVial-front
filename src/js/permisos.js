// Las demás páginas internas están disponibles para cualquier usuario con sesión.
export const permisos = {
    usuarios: ['administrador'],
    'usuario-detalle': ['administrador'],
    'usuario-formulario': ['administrador'],
};

export function puedeEntrar(pagina, rol) {
    const roles = Object.hasOwn(permisos, pagina) ? permisos[pagina] : undefined;
    return !roles || roles.includes(rol);
}
