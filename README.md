# RescateVial

**RescateVial** es una plataforma web para apoyar el registro y seguimiento de incidentes viales y la coordinación de unidades de asistencia. Este repositorio contiene las pantallas del frontend, desarrolladas con HTML, CSS, JavaScript y Vite.

En la versión actual se puede:

- Consultar las unidades de asistencia y sus datos, así como agregar o editar unidades.
- Consultar los usuarios registrados y agregar o editar usuarios.
- Navegar desde la portada hasta el inicio de sesión y el panel principal.

La sección de **Incidentes** permite consultar, crear, editar y eliminar reportes guardados en este navegador.

# Integrantes

| Autor | GitHub |
| --- | --- |
| Angel Omar Luna Castillo | [@geloou1712](https://github.com/geloou1712) |
| Santiago Ley Rodriguez | [@santiagoleymy-lang](https://github.com/santiagoleymy-lang) |

# Lista de pantallas

| Pantalla | Archivo | Descripción |
| --- | --- | --- |
| Portada | `index.html` | Presenta el sistema y lleva al inicio de sesión. |
| Inicio de sesión | `login.html` | Autentica con correo, contraseña y rol, y guarda la sesión devuelta por la API. |
| Panel principal | `home.html` | Muestra los accesos a los módulos. |
| Usuarios | `usuarios.html` | Muestra la lista de usuarios. |
| Detalle de usuario | `usuario-detalle.html?id=1` | Muestra la información de un usuario. |
| Formulario de usuario | `usuario-formulario.html` | Permite agregar o editar un usuario. |
| Unidades | `unidades.html` | Muestra la lista de unidades de asistencia. |
| Detalle de unidad | `unidad-detalle.html?id=1` | Muestra la información de una unidad. |
| Formulario de unidad | `unidad-formulario.html` | Permite agregar o editar una unidad. |

# Datos y funcionamiento

Los datos de ejemplo están definidos en `src/js/datos.js` como arreglos de objetos. Las funciones para consultarlos y modificarlos son asíncronas, y los cambios se guardan en el navegador con `localStorage`.

El registro y el inicio de sesión usan la API configurada en VITE_API_URL. La sesión (token y usuario) se administra en src/js/sesion.js. El cliente src/js/api.js envía Bearer en las peticiones protegidas y cierra la sesión cuando recibe un 401. El inicio consulta /api/auth/yo para validar el token y mostrar el saludo.

Todas las páginas internas importan primero src/js/main.js para exigir sesión. Los roles del proyecto son ciudadano, operador y administrador. Solo administrador accede a usuarios.html, usuario-detalle.html y usuario-formulario.html; las demás páginas internas requieren sesión y están disponibles para los tres roles. Las reglas viven en src/js/permisos.js y también ocultan los enlaces y tarjetas sin permiso. El rol de la sesión proviene de la respuesta de la API; el selector del login se comprueba contra ese valor.

Los datos de usuarios, unidades e incidentes siguen siendo de demostración en localStorage. El formulario administrativo de usuarios no registra cuentas en la API: las cuentas de autenticación se crean desde registro.html. Los controles del navegador deben complementarse con autorización en la API propia cuando se conecten esos módulos.

# Configuración de autenticación

- .env.example documenta la URL de una API propia local (http://localhost:8080).
- Crear .env.local con VITE_API_URL=https://fakeapi-l9ei.onrender.com para usar la API temporal. Git ignora este archivo mediante *.local.
- Reiniciar Vite después de cambiar la variable.
- En Vercel, configurar VITE_API_URL en Settings → Environment Variables y hacer Redeploy. La variable se incorpora durante la compilación.

# Comprobación de la guía

| Paso | Estado |
| --- | --- |
| 1. Variable de entorno | .env.example versionado; .env.local local e ignorado. |
| 2. Sesión compartida | src/js/sesion.js guarda, lee y borra token y usuario. |
| 3. Cliente API | GET, POST, PUT y DELETE, Bearer, errores y cierre por 401. |
| 4. Permisos | Las tres páginas de usuarios requieren administrador. |
| 5. Login | Correo, contraseña, rol, errores y estado de carga. |
| 6. Header | Nombre, iniciales y cierre de sesión. |
| 7. Protección común | Las diez páginas internas cargan main.js antes de su código. |
| 8. Token en el inicio | GET /api/auth/yo y saludo obtenido de la API. |
| 9. Cuentas por rol | Pendiente de verificación en la API temporal con cuentas de prueba. |
| 10. Vercel | Pendiente de verificar la variable y el redeploy en el proyecto publicado. |

Para probar manualmente: crear cuentas de prueba con roles distintos desde registro.html, iniciar sesión, comprobar que ciudadano y operador no ven Usuarios y que tampoco acceden escribiendo sus URL, comprobar que administrador sí entra y cerrar sesión. Al borrar o invalidar el token, /api/auth/yo debe devolver 401 y volver al login. El servicio temporal puede tardar alrededor de un minuto en despertar, según la guía.

Las pruebas locales con npm test simulan la API y el navegador; no crean cuentas externas ni verifican el despliegue. Usan los módulos VM de Node.js para ejecutar los archivos reales, incluida la variable de Vite y la plantilla del header.

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
