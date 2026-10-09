const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = 'https://taskflow.local';

test('API TaskFlow: salud y operaciones CRUD', async (t) => {
    let idTareaPrueba = null;

    // Si falla una comprobación intermedia, intenta limpiar la tarea creada.
    t.after(async () => {
        if (idTareaPrueba !== null) {
            await fetch(`${BASE_URL}/api/tareas/${idTareaPrueba}`, {
                method: 'DELETE'
            });
        }
    });

    await t.test('La API y MySQL están disponibles', async () => {
        const respuesta = await fetch(`${BASE_URL}/api/health`);
        assert.equal(respuesta.status, 200);

        const datos = await respuesta.json();
        assert.equal(datos.estado, 'correcto');
        assert.equal(datos.servidor, 'Express');
        assert.equal(datos.baseDatos, 'conectada');
    });

    await t.test('Se pueden consultar las tareas', async () => {
        const respuesta = await fetch(`${BASE_URL}/api/tareas`);
        assert.equal(respuesta.status, 200);

        const tareas = await respuesta.json();
        assert.ok(Array.isArray(tareas));
    });

    await t.test('Se rechaza una tarea sin título', async () => {
        const respuesta = await fetch(`${BASE_URL}/api/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: '', prioridad: 'media' })
        });

        assert.equal(respuesta.status, 400);
    });

    await t.test('Se crea una tarea temporal', async () => {
        const respuesta = await fetch(`${BASE_URL}/api/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: `Prueba automatizada ${Date.now()}`,
                prioridad: 'alta'
            })
        });

        assert.equal(respuesta.status, 201);

        const tarea = await respuesta.json();
        assert.ok(Number.isInteger(tarea.id));
        assert.equal(tarea.prioridad, 'alta');
        assert.equal(tarea.completada, 0);

        idTareaPrueba = tarea.id;
    });

    await t.test('La tarea creada aparece en la consulta', async () => {
        assert.ok(idTareaPrueba !== null, 'Debe existir una tarea de prueba');

        const respuesta = await fetch(`${BASE_URL}/api/tareas`);
        assert.equal(respuesta.status, 200);

        const tareas = await respuesta.json();
        assert.ok(tareas.some(tarea => tarea.id === idTareaPrueba));
    });

    await t.test('Se puede marcar como completada', async () => {
        assert.ok(idTareaPrueba !== null);

        const respuesta = await fetch(
            `${BASE_URL}/api/tareas/${idTareaPrueba}/estado`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completada: true })
            }
        );

        assert.equal(respuesta.status, 200);

        const tarea = await respuesta.json();
        assert.equal(Number(tarea.completada), 1);
    });

    await t.test('Se puede eliminar la tarea temporal', async () => {
        assert.ok(idTareaPrueba !== null);

        const respuesta = await fetch(
            `${BASE_URL}/api/tareas/${idTareaPrueba}`,
            { method: 'DELETE' }
        );

        assert.equal(respuesta.status, 204);
        idTareaPrueba = null;
    });
});
