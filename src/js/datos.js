const usuariosIniciales = [
    { id: 1, nombre: "Juan Pérez", correo: "juan@example.com", telefono: "5550000001", rol: "CIUDADANO", estado: "ACTIVO" },
    { id: 2, nombre: "María López", correo: "maria@example.com", telefono: "5550000002", rol: "CIUDADANO", estado: "ACTIVO" }
];

const datosGuardados = localStorage.getItem("usuarios");
const usuarios = datosGuardados ? JSON.parse(datosGuardados) : usuariosIniciales;

function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export async function obtenerUsuarios() {
    return usuarios;
}

export async function obtenerUsuarioPorId(id) {
    return usuarios.find(usuario => usuario.id === Number(id));
}

export async function agregarUsuario(datos) {
    const nuevoUsuario = { id: Date.now(), ...datos };
    usuarios.push(nuevoUsuario);
    guardarUsuarios();
    return nuevoUsuario;
}

export async function actualizarUsuario(id, datos) {
    const usuario = await obtenerUsuarioPorId(id);
    if (!usuario) return null;
    Object.assign(usuario, datos);
    guardarUsuarios();
    return usuario;
}
