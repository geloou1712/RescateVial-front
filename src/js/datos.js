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

const unidadesIniciales = [
    {
        id: 1,
        codigo_unidad: "AMB-01",
        tipo_unidad: "Ambulancia",
        placas: "ABC-123",
        marca: "Ford",
        modelo: "Transit",
        capacidad: 2,
        ubicacion_actual: "Base Centro",
        disponibilidad: "Disponible",
        estado: "Activa"
    },
    {
        id: 2,
        codigo_unidad: "GRU-01",
        tipo_unidad: "Grúa",
        placas: "XYZ-456",
        marca: "International",
        modelo: "MV",
        capacidad: 1,
        ubicacion_actual: "Base Norte",
        disponibilidad: "En servicio",
        estado: "Activa"
    }
];

const unidadesGuardadas = localStorage.getItem("unidades");
const unidades = unidadesGuardadas
    ? JSON.parse(unidadesGuardadas)
    : unidadesIniciales;

function guardarUnidades() {
    localStorage.setItem("unidades", JSON.stringify(unidades));
}

export async function obtenerUnidades() {
    return unidades;
}

export async function obtenerUnidadPorId(id) {
    return unidades.find(unidad => unidad.id === Number(id));
}

export async function agregarUnidad(datos) {
    const nuevaUnidad = {
        id: Date.now(),
        ...datos,
        capacidad: Number(datos.capacidad)
    };

    unidades.push(nuevaUnidad);
    guardarUnidades();
    return nuevaUnidad;
}

export async function actualizarUnidad(id, datos) {
    const unidad = await obtenerUnidadPorId(id);

    if (!unidad) return null;

    Object.assign(unidad, datos, {
        capacidad: Number(datos.capacidad)
    });

    guardarUnidades();
    return unidad;
}