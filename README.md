# RescateVial

RescateVial es la interfaz de un sistema para consultar incidentes viales y organizar la atención mediante unidades de asistencia. Este repositorio contiene el frontend desarrollado con HTML, CSS, JavaScript y Vite.

**Sitio publicado:** [rescatevialfr.vercel.app](https://rescatevialfr.vercel.app)

## Pantallas

| Pantalla | Archivo | Función |
| --- | --- | --- |
| Portada | `index.html` | Presenta el sistema y permite ir al inicio de sesión. |
| Inicio de sesión | `login.html` | Muestra el formulario de acceso y dirige al inicio del sistema. |
| Inicio del sistema | `home.html` | Muestra los accesos a los módulos. |
| Lista de usuarios | `usuarios.html` | Consulta los usuarios registrados. |
| Detalle de usuario | `usuario-detalle.html?id=1` | Muestra un usuario por su identificador. |
| Formulario de usuario | `usuario-formulario.html` | Permite agregar o editar un usuario. |
| Lista de unidades | `unidades.html` | Consulta las unidades de asistencia. |
| Detalle de unidad | `unidad-detalle.html?id=1` | Muestra una unidad por su identificador. |
| Formulario de unidad | `unidad-formulario.html` | Permite agregar o editar una unidad. |

El inicio muestra un acceso a **Incidentes**, pero su pantalla todavía está pendiente de implementación.

## Estado de los datos

Esta versión usa arreglos de objetos y funciones asíncronas en `src/js/datos.js`. Los cambios se conservan en el navegador mediante `localStorage`. El inicio de sesión es una demostración: todavía no autentica usuarios. La conexión con la API de Spring Boot se realizará en una etapa posterior.

## Ejecutar el proyecto

Necesitas tener instalados Node.js y npm. Después de clonar el repositorio, ejecuta:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que muestre Vite. Para comprobar que el proyecto se puede compilar:

```bash
npm run build
```

## Estructura

- Las páginas HTML están en la raíz del proyecto.
- `src/css/` contiene los estilos.
- `src/js/` contiene la lógica de las pantallas y los datos de ejemplo.
- `src/partials/` contiene elementos compartidos, como la navegación.
- `vite.config.js` configura la compilación de las distintas páginas.

## Integrantes

- [@geloou1712](https://github.com/geloou1712)
- [@santiagoleymy-lang](https://github.com/santiagoleymy-lang)
