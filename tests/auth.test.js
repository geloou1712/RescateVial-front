import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const ciudadano = { name: 'Ana Torres', role: 'ciudadano' };
const administrador = { name: 'Luis Pérez', role: 'administrador' };
const respuesta = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

function entorno({ usuario, ruta = 'home.html', fetch = async () => respuesta(200, ciudadano), env = 'https://api.example.test/' } = {}) {
    const storage = new Map();
    if (usuario) storage.set('sesion', JSON.stringify({ token: 'token-prueba', usuario }));
    const eventos = {};
    const reemplazos = [];
    const llamadas = [];
    const elementos = new Map();
    function elemento(id) {
        if (!elementos.has(id)) elementos.set(id, {
            textContent: '', hidden: false, disabled: false, innerHTML: '', attributes: {},
            classList: { add() {} },
            setAttribute(name, value) { this.attributes[name] = value; },
            addEventListener(name, callback) { this[name] = callback; },
        });
        return elementos.get(id);
    }
    const enlaces = ['home.html', 'incidentes.html', 'unidades.html', 'usuarios.html',
        'usuario-detalle.html?id=1', 'usuario-formulario.html?id=1', 'https://otro.example/usuarios.html']
        .map(href => ({ href, eliminado: false, getAttribute() { return href; }, remove() { this.eliminado = true; } }));
    const formulario = elemento('#form-login');
    formulario.querySelector = () => elemento('boton');
    formulario.datos = { email: ' ana@example.com ', password: 'secreto', role: 'ciudadano' };
    const url = new URL(ruta, 'https://front.example/');
    const location = { href: url.href, origin: url.origin, pathname: url.pathname,
        replace(value) { reemplazos.push(value); }, reload() { reemplazos.push('reload'); } };
    const sandbox = {
        URL,
        localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
        location,
        document: {
            body: { hidden: false, dataset: { seccion: ruta.startsWith('usuario') ? 'usuarios' : 'home' } },
            querySelector: selector => elemento(selector), querySelectorAll: () => enlaces,
        },
        window: { addEventListener: (name, callback) => { eventos[name] = callback; } },
        FormData: class { constructor(form) { this.form = form; } [Symbol.iterator]() { return Object.entries(this.form.datos)[Symbol.iterator](); } },
        fetch: async (...args) => { llamadas.push(args); return fetch(...args); },
    };
    const context = vm.createContext(sandbox);
    const cache = new Map();
    async function cargar(url) {
        if (cache.has(url.href)) return cache.get(url.href);
        const raw = url.search === '?raw';
        const contenido = await fs.readFile(new URL(url.pathname, url), 'utf8');
        const modulo = new vm.SourceTextModule(raw ? `export default ${JSON.stringify(contenido)};` : contenido, {
            context, identifier: url.href,
            initializeImportMeta(meta) { meta.env = { VITE_API_URL: env }; },
        });
        cache.set(url.href, modulo);
        return modulo;
    }
    async function importar(nombre) {
        const modulo = await cargar(new URL('src/js/' + nombre, root));
        if (modulo.status === 'unlinked') await modulo.link((specifier, parent) => cargar(new URL(specifier, parent.identifier)));
        if (modulo.status === 'linked') await modulo.evaluate();
        return modulo.namespace;
    }
    return { importar, storage, elementos, elemento, formulario, enlaces, eventos, reemplazos, llamadas, sandbox };
}

test('la sesión se guarda, se lee y se borra al salir', async () => {
    const e = entorno();
    const sesion = await e.importar('sesion.js');
    assert.equal(sesion.obtenerUsuario(), null);
    sesion.guardarSesion('token', ciudadano);
    assert.equal(sesion.obtenerToken(), 'token');
    assert.equal(sesion.obtenerUsuario().name, ciudadano.name);
    sesion.cerrarSesion();
    assert.equal(e.storage.has('sesion'), false);
    assert.deepEqual(e.reemplazos, ['login.html']);
});

test('las sesiones dañadas o incompletas no permiten acceso', async () => {
    for (const value of ['{', 'null', '{}', '{"usuario":{"name":"Ana","role":"administrador"}}', '{"token":"","usuario":{"name":"Ana","role":"administrador"}}']) {
        const e = entorno();
        e.storage.set('sesion', value);
        const sesion = await e.importar('sesion.js');
        assert.equal(sesion.obtenerUsuario(), null);
        assert.equal(e.storage.has('sesion'), false);
    }
});

test('las tres páginas de usuarios exigen administrador', async () => {
    const { puedeEntrar } = await entorno().importar('permisos.js');
    for (const pagina of ['usuarios', 'usuario-detalle', 'usuario-formulario']) {
        assert.equal(puedeEntrar(pagina, 'administrador'), true);
        for (const rol of ['ciudadano', 'operador', undefined]) assert.equal(puedeEntrar(pagina, rol), false);
    }
    for (const pagina of ['home', 'incidentes', 'incidente-detalle', 'incidente-formulario', 'unidades', 'unidad-detalle', 'unidad-formulario']) {
        for (const rol of ['ciudadano', 'operador', 'administrador']) assert.equal(puedeEntrar(pagina, rol), true);
    }
});

test('entrar sin sesión redirige antes de inicializar la navegación', async () => {
    const e = entorno();
    await assert.rejects(e.importar('main.js'), /Sin sesión/);
    assert.deepEqual(e.reemplazos, ['login.html']);
    assert.equal(e.elemento('#site-nav').innerHTML, '');
});

test('las URL directas de usuarios rechazan ciudadano y operador', async () => {
    for (const rol of ['ciudadano', 'operador']) {
        for (const ruta of ['usuarios.html', 'usuario-detalle.html?id=1', 'usuario-formulario.html?id=1']) {
            const e = entorno({ usuario: { ...ciudadano, role: rol }, ruta });
            await assert.rejects(e.importar('main.js'), /Sin permiso/);
            assert.deepEqual(e.reemplazos, ['home.html']);
        }
    }
});

test('los enlaces y las tarjetas de usuarios se ocultan según el rol', async () => {
    for (const usuario of [ciudadano, administrador]) {
        const e = entorno({ usuario });
        await e.importar('main.js');
        assert.equal(e.elemento('#nombre-usuario').textContent, usuario.name);
        assert.equal(e.elemento('#avatar-usuario').textContent, usuario === ciudadano ? 'AT' : 'LP');
        assert.equal(e.enlaces[3].eliminado, usuario === ciudadano);
        assert.equal(e.enlaces[4].eliminado, usuario === ciudadano);
        assert.equal(e.enlaces[5].eliminado, usuario === ciudadano);
        assert.equal(e.enlaces[6].eliminado, false);
        assert.equal(e.enlaces[1].eliminado, false);
        e.elemento('#cerrar-sesion').click({ preventDefault() {} });
        assert.equal(e.storage.has('sesion'), false);
    }
});

test('el historial revisa la sesión al restaurar una página', async () => {
    const e = entorno({ usuario: ciudadano });
    await e.importar('main.js');
    e.storage.delete('sesion');
    e.eventos.pageshow({ persisted: true });
    assert.deepEqual(e.reemplazos, ['login.html']);
});

test('el cliente envía Bearer y soporta GET, POST, PUT y DELETE', async () => {
    const e = entorno({ usuario: ciudadano });
    const { api } = await e.importar('api.js');
    await api.get('/recurso');
    await api.post('/recurso', { nombre: 'Ana' });
    await api.put('/recurso', { nombre: 'Luis' });
    await api.delete('/recurso');
    assert.deepEqual(e.llamadas.map(([, options]) => options.method), ['GET', 'POST', 'PUT', 'DELETE']);
    for (const [url, options] of e.llamadas) {
        assert.equal(url, 'https://api.example.test/recurso');
        assert.equal(options.headers.Authorization, 'Bearer token-prueba');
    }
    assert.equal(e.llamadas[0][1].body, undefined);
    assert.equal(e.llamadas[1][1].headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(e.llamadas[1][1].body), { nombre: 'Ana' });
});

test('un 401 protegido elimina la sesión; un login rechazado muestra el error', async () => {
    const e = entorno({ usuario: ciudadano, fetch: async () => respuesta(401, { message: 'Credenciales incorrectas' }) });
    const { api } = await e.importar('api.js');
    await assert.rejects(api.post('/api/auth/login', {}), /Credenciales incorrectas/);
    assert.equal(e.llamadas[0][1].headers.Authorization, undefined);
    assert.equal(e.reemplazos.length, 0);
    await assert.rejects(api.get('/api/auth/yo'), /sesión expiró/);
    assert.equal(e.storage.has('sesion'), false);
    assert.deepEqual(e.reemplazos, ['login.html']);
});

test('un registro rechazado no envía el token ni cierra la sesión', async () => {
    const e = entorno({ usuario: ciudadano, fetch: async () => respuesta(401, { message: 'Registro rechazado' }) });
    const { api } = await e.importar('api.js');
    await assert.rejects(api.post('/api/auth/registro', { email: 'ana@example.com' }), /Registro rechazado/);
    assert.equal(e.llamadas[0][1].headers.Authorization, undefined);
    assert.equal(e.storage.has('sesion'), true);
    assert.deepEqual(e.reemplazos, []);
});

test('los fallos de red, 403 y falta de configuración conservan mensajes útiles', async () => {
    const sinRed = entorno({ fetch: async () => { throw new Error('offline'); } });
    await assert.rejects((await sinRed.importar('api.js')).api.get('/recurso'), /No se pudo conectar/);
    const prohibido = entorno({ usuario: ciudadano, fetch: async () => respuesta(403, { message: 'Acceso denegado' }) });
    await assert.rejects((await prohibido.importar('api.js')).api.get('/recurso'), /Acceso denegado/);
    assert.equal(prohibido.storage.has('sesion'), true);
    const sinEnv = entorno({ env: '' });
    await assert.rejects((await sinEnv.importar('api.js')).api.get('/recurso'), /VITE_API_URL/);
    assert.equal(sinEnv.llamadas.length, 0);
});

test('login guarda el usuario de la API, envía el rol y restaura el botón', async () => {
    const e = entorno({ fetch: async () => respuesta(200, { token: 'nuevo', user: ciudadano }) });
    await e.importar('login.js');
    await e.formulario.submit({ preventDefault() {} });
    assert.equal(e.sandbox.location.href, 'home.html');
    assert.deepEqual(JSON.parse(e.storage.get('sesion')), { token: 'nuevo', usuario: ciudadano });
    assert.deepEqual(JSON.parse(e.llamadas[0][1].body), { email: 'ana@example.com', password: 'secreto', role: 'ciudadano' });
    assert.equal(e.elemento('boton').disabled, false);
});

test('elegir administrador no concede ese rol a una cuenta ciudadana', async () => {
    const e = entorno({ fetch: async () => respuesta(200, { token: 'nuevo', user: ciudadano }) });
    e.formulario.datos.role = 'administrador';
    await e.importar('login.js');
    await e.formulario.submit({ preventDefault() {} });
    assert.equal(e.storage.has('sesion'), false);
    assert.match(e.elemento('#mensaje-login').textContent, /no coincide/);
    assert.equal(e.elemento('#mensaje-login').hidden, false);
    assert.equal(e.elemento('boton').disabled, false);
});

test('el home consulta /yo y muestra el nombre devuelto por la API', async () => {
    const e = entorno({ usuario: ciudadano, fetch: async () => respuesta(200, { name: 'Nombre Verificado' }) });
    await e.importar('home.js');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(e.llamadas[0][0], 'https://api.example.test/api/auth/yo');
    assert.equal(e.elemento('#saludo-nombre').textContent, 'Nombre');
});

test('un token vencido en el home regresa al login', async () => {
    const e = entorno({ usuario: ciudadano, fetch: async () => respuesta(401, {}) });
    await e.importar('home.js');
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(e.reemplazos, ['login.html']);
    assert.equal(e.storage.has('sesion'), false);
});

test('cada página interna carga su módulo y protege su código primero', async () => {
    const paginas = ['home', 'usuarios', 'usuario-detalle', 'usuario-formulario', 'unidades', 'unidad-detalle', 'unidad-formulario', 'incidentes', 'incidente-detalle', 'incidente-formulario'];
    for (const pagina of paginas) {
        const html = await fs.readFile(new URL(pagina + '.html', root), 'utf8');
        const js = await fs.readFile(new URL('src/js/' + pagina + '.js', root), 'utf8');
        assert.match(html, new RegExp('src/js/' + pagina + '\\.js'));
        assert.ok(js.startsWith("import './main.js';"), pagina);
        assert.match(html, /data-seccion=/);
    }
    const login = await fs.readFile(new URL('login.html', root), 'utf8');
    const registro = await fs.readFile(new URL('registro.html', root), 'utf8');
    for (const rol of ['ciudadano', 'operador', 'administrador']) {
        assert.ok(login.includes(`value="${rol}"`));
        assert.ok(registro.includes(`value="${rol}"`));
    }
});
