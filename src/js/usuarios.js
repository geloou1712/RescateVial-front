import {obtenerUsuarios} from './datos.js';
const listaUsuarios = document.querySelector('#lista-usuarios');
async function mostrarUsuarios() {
    const usuarios = await obtenerUsuarios();
    if(usuarios.length === 0) {
       const mensaje = document.createElement('li');
         mensaje.textContent = 'No hay usuarios disponibles';
        listaUsuarios.appendChild(mensaje); 
        return;
    }
   usuarios.forEach(function(usuario) {
        const elemento = document.createElement('li');
       const enlace = document.createElement('a');
        enlace.textContent = usuario.nombre;
        enlace.href = `usuario-detalle.html?id=${usuario.id}`;
        elemento.appendChild(enlace);
        listaUsuarios.appendChild(elemento);
    });
}
mostrarUsuarios().catch(function () {
    const mensaje = document.createElement('li');
    mensaje.textContent = 'No se pudo cargar la lista de usuarios.';
    listaUsuarios.appendChild(mensaje);
});
