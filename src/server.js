require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const pool = require('./db/connection');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Entrega la interfaz web existente desde la ra?z del proyecto.
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS conexion');

        res.json({
            estado: 'correcto',
            servidor: 'Express',
            baseDatos: rows[0].conexion === 1 ? 'conectada' : 'sin verificar'
        });
    } catch (error) {
        console.error('Error al comprobar MySQL:', error.message);
        res.status(500).json({
            estado: 'error',
            mensaje: 'No se pudo verificar la conexi?n con la base de datos.'
        });
    }
});

// Consultar todas las tareas.
app.get('/api/tareas', async (req, res) => {
    try {
        const [tareas] = await pool.query(
            `SELECT id, titulo, prioridad, completada,
                    fecha_creacion, fecha_actualizacion
             FROM tareas
             ORDER BY id DESC`
        );

        res.json(tareas);
    } catch (error) {
        console.error('Error al consultar tareas:', error.message);
        res.status(500).json({
            error: 'No se pudieron consultar las tareas.'
        });
    }
});

// Crear una tarea.
app.post('/api/tareas', async (req, res) => {
    const titulo = typeof req.body.titulo === 'string'
        ? req.body.titulo.trim()
        : '';

    const prioridadesValidas = ['baja', 'media', 'alta'];
    const prioridad = req.body.prioridad || 'media';

    if (!titulo || titulo.length > 200) {
        return res.status(400).json({
            error: 'El t?tulo es obligatorio y debe tener como m?ximo 200 caracteres.'
        });
    }

    if (!prioridadesValidas.includes(prioridad)) {
        return res.status(400).json({
            error: 'La prioridad debe ser baja, media o alta.'
        });
    }

    try {
        const [resultado] = await pool.execute(
            'INSERT INTO tareas (titulo, prioridad) VALUES (?, ?)',
            [titulo, prioridad]
        );

        const [filas] = await pool.execute(
            `SELECT id, titulo, prioridad, completada,
                    fecha_creacion, fecha_actualizacion
             FROM tareas WHERE id = ?`,
            [resultado.insertId]
        );

        res.status(201).json(filas[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        res.status(500).json({
            error: 'No se pudo crear la tarea.'
        });
    }
});

// Cambiar una tarea entre completada y pendiente.
app.patch('/api/tareas/:id/estado', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID de tarea no v?lido.' });
    }

    if (typeof req.body.completada !== 'boolean') {
        return res.status(400).json({
            error: 'Debes indicar completada como true o false.'
        });
    }

    try {
        const [resultado] = await pool.execute(
            'UPDATE tareas SET completada = ? WHERE id = ?',
            [req.body.completada, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        const [filas] = await pool.execute(
            `SELECT id, titulo, prioridad, completada,
                    fecha_creacion, fecha_actualizacion
             FROM tareas WHERE id = ?`,
            [id]
        );

        res.json(filas[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);
        res.status(500).json({
            error: 'No se pudo actualizar la tarea.'
        });
    }
});

// Eliminar una tarea.
app.delete('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID de tarea no v?lido.' });
    }

    try {
        const [resultado] = await pool.execute(
            'DELETE FROM tareas WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);
        res.status(500).json({
            error: 'No se pudo eliminar la tarea.'
        });
    }
});

const servidor = app.listen(PORT, () => {
    console.log(`TaskFlow disponible en http://localhost:${PORT}`);
});

async function cerrarServidor() {
    servidor.close(async () => {
        await pool.end();
        process.exit(0);
    });
}

process.on('SIGINT', cerrarServidor);
process.on('SIGTERM', cerrarServidor);
