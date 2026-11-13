import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  input: {
    portada: resolve(process.cwd(), 'index.html'),
    login: resolve(process.cwd(), 'login.html'),
    home: resolve(process.cwd(), 'home.html'),
    usuarios: resolve(process.cwd(), 'usuarios.html'),
    usuarioDetalle: resolve(process.cwd(), 'usuario-detalle.html'),
    usuarioFormulario: resolve(process.cwd(), 'usuario-formulario.html'),
    unidades: resolve(process.cwd(), 'unidades.html'),
    unidadDetalle: resolve(process.cwd(), 'unidad-detalle.html'),
    unidadFormulario: resolve(process.cwd(), 'unidad-formulario.html'),
  },
});