# RescateVial

**RescateVial** es una plataforma web para apoyar el registro y seguimiento de incidentes viales y la coordinación de unidades de asistencia. Este repositorio contiene las pantallas del frontend, desarrolladas con HTML, CSS, JavaScript y Vite.

En la versión actual se puede:

- Consultar las unidades de asistencia y sus datos, así como agregar o editar unidades.
- Consultar los usuarios registrados y agregar o editar usuarios.
- Navegar desde la portada hasta el inicio de sesión y el panel principal.

La sección de **Incidentes** aparece como acceso en el panel principal, pero su pantalla todavía está pendiente de implementación.

# Integrantes

| Autor | GitHub |
| --- | --- |
| Angel Omar Luna Castillo | [@geloou1712](https://github.com/geloou1712) |
| Santiago Ley Rodriguez | [@santiagoleymy-lang](https://github.com/santiagoleymy-lang) |

# Lista de pantallas

| Pantalla | Archivo | Descripción |
| --- | --- | --- |
| Portada | `index.html` | Presenta el sistema y lleva al inicio de sesión. |
| Inicio de sesión | `login.html` | Recibe los datos del formulario y abre el panel principal. |
| Panel principal | `home.html` | Muestra los accesos a los módulos. |
| Usuarios | `usuarios.html` | Muestra la lista de usuarios. |
| Detalle de usuario | `usuario-detalle.html?id=1` | Muestra la información de un usuario. |
| Formulario de usuario | `usuario-formulario.html` | Permite agregar o editar un usuario. |
| Unidades | `unidades.html` | Muestra la lista de unidades de asistencia. |
| Detalle de unidad | `unidad-detalle.html?id=1` | Muestra la información de una unidad. |
| Formulario de unidad | `unidad-formulario.html` | Permite agregar o editar una unidad. |

# Datos y funcionamiento

Los datos de ejemplo están definidos en `src/js/datos.js` como arreglos de objetos. Las funciones para consultarlos y modificarlos son asíncronas, y los cambios se guardan en el navegador con `localStorage`.

El inicio de sesión es de demostración y todavía no autentica usuarios. Este frontend aún no está conectado con la API de Spring Boot.

# Comandos

Para ejecutar el proyecto localmente, necesitas Node.js y npm.

1. **Instalar dependencias.** Abre una terminal en la raíz del repositorio y ejecuta:

   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo.** Ejecuta:

   ```bash
   npm run dev
   ```

   Abre la dirección local que Vite muestre en la terminal.

3. **Comprobar la compilación.** Ejecuta:

   ```bash
   npm run build
   ```

# Sitio publicado

[Ver RescateVial en Vercel](https://rescatevialfr.vercel.app)
