const formulario = document.getElementById("formulario-tarea");
const tituloTarea = document.getElementById("titulo-tarea");
const prioridadTarea = document.getElementById("prioridad-tarea");
const listaTareas = document.getElementById("lista-tareas");
const totalTareas = document.getElementById("total-tareas");
const pendientesTareas = document.getElementById("pendientes-tareas");
const completadasTareas = document.getElementById("completadas-tareas");
const filtros = document.querySelectorAll(".filtro");

let tareas = [];
let filtroActual = "todas";
let procesando = false;

async function solicitarAPI(url, opciones = {}) {
    const respuesta = await fetch(url, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            ...opciones.headers
        }
    });

    if (!respuesta.ok) {
        let mensaje = `Error del servidor (${respuesta.status}).`;

        try {
            const datos = await respuesta.json();
            mensaje = datos.error || datos.mensaje || mensaje;
        } catch {
            // La respuesta puede no contener JSON.
        }

        throw new Error(mensaje);
    }

    if (respuesta.status === 204) {
        return null;
    }

    return respuesta.json();
}

function mostrarError(mensaje) {
    alert(mensaje);
}

async function cargarTareas() {
    try {
        tareas = await solicitarAPI("/api/tareas");
        mostrarTareas();
    } catch (error) {
        mostrarError(
            `No se pudieron cargar las tareas. ${error.message}`
        );
    }
}

async function agregarTarea(evento) {
    evento.preventDefault();

    if (procesando) return;

    const titulo = tituloTarea.value.trim();

    if (!titulo) {
        tituloTarea.focus();
        return;
    }

    procesando = true;

    try {
        await solicitarAPI("/api/tareas", {
            method: "POST",
            body: JSON.stringify({
                titulo,
                prioridad: prioridadTarea.value
            })
        });

        formulario.reset();
        prioridadTarea.value = "media";
        await cargarTareas();
    } catch (error) {
        mostrarError(`No se pudo crear la tarea. ${error.message}`);
    } finally {
        procesando = false;
    }
}

async function eliminarTarea(id) {
    const tarea = tareas.find((elemento) => elemento.id === id);

    if (!tarea || procesando) return;

    const confirmar = confirm(
        `¿Seguro que deseas eliminar la tarea "${tarea.titulo}"?`
    );

    if (!confirmar) return;

    procesando = true;

    try {
        await solicitarAPI(`/api/tareas/${id}`, {
            method: "DELETE"
        });

        await cargarTareas();
    } catch (error) {
        mostrarError(`No se pudo eliminar la tarea. ${error.message}`);
    } finally {
        procesando = false;
    }
}

async function cambiarEstado(id) {
    const tarea = tareas.find((elemento) => elemento.id === id);

    if (!tarea || procesando) return;

    procesando = true;

    try {
        await solicitarAPI(`/api/tareas/${id}/estado`, {
            method: "PATCH",
            body: JSON.stringify({
                completada: !Boolean(tarea.completada)
            })
        });

        await cargarTareas();
    } catch (error) {
        mostrarError(`No se pudo actualizar la tarea. ${error.message}`);
    } finally {
        procesando = false;
    }
}

function obtenerTareasFiltradas() {
    if (filtroActual === "pendientes") {
        return tareas.filter((tarea) => !Boolean(tarea.completada));
    }

    if (filtroActual === "completadas") {
        return tareas.filter((tarea) => Boolean(tarea.completada));
    }

    return tareas;
}

function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";

    return new Date(fecha).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function crearElementoTarea(tarea) {
    const elemento = document.createElement("article");
    const completada = Boolean(tarea.completada);

    elemento.className = `tarea prioridad-${tarea.prioridad}`;

    if (completada) {
        elemento.classList.add("tarea-completada");
    }

    const informacion = document.createElement("div");
    informacion.className = "tarea-info";

    const titulo = document.createElement("div");
    titulo.className = "tarea-titulo";
    titulo.textContent = tarea.titulo;

    const prioridad = document.createElement("span");
    prioridad.className = "tarea-prioridad";
    prioridad.textContent = `Prioridad: ${tarea.prioridad.toUpperCase()}`;

    const fecha = document.createElement("span");
    fecha.className = "tarea-fecha";
    fecha.textContent =
        `Creada: ${formatearFecha(tarea.fecha_creacion)}`;

    informacion.append(titulo, prioridad, fecha);

    const acciones = document.createElement("div");
    acciones.className = "tarea-acciones";

    const botonEstado = document.createElement("button");
    botonEstado.className = "boton boton-secundario";
    botonEstado.dataset.accion = "estado";
    botonEstado.dataset.id = tarea.id;
    botonEstado.textContent = completada ? "Reabrir" : "Completar";

    const botonEliminar = document.createElement("button");
    botonEliminar.className = "boton boton-eliminar";
    botonEliminar.dataset.accion = "eliminar";
    botonEliminar.dataset.id = tarea.id;
    botonEliminar.textContent = "Eliminar";

    acciones.append(botonEstado, botonEliminar);
    elemento.append(informacion, acciones);

    return elemento;
}

function mostrarTareas() {
    const tareasFiltradas = obtenerTareasFiltradas();

    listaTareas.innerHTML = "";

    if (tareasFiltradas.length === 0) {
        const mensaje = document.createElement("div");
        mensaje.className = "mensaje-vacio";

        const parrafo = document.createElement("p");
        parrafo.textContent = "No hay tareas para mostrar.";

        const detalle = document.createElement("span");
        detalle.textContent = "Agrega una nueva tarea para comenzar.";

        mensaje.append(parrafo, detalle);
        listaTareas.appendChild(mensaje);
    } else {
        tareasFiltradas.forEach((tarea) => {
            listaTareas.appendChild(crearElementoTarea(tarea));
        });
    }

    const total = tareas.length;
    const completadas = tareas.filter(
        (tarea) => Boolean(tarea.completada)
    ).length;
    const pendientes = total - completadas;

    totalTareas.textContent = total;
    pendientesTareas.textContent = pendientes;
    completadasTareas.textContent = completadas;
}

function cambiarFiltro(filtro) {
    filtroActual = filtro;

    filtros.forEach((boton) => {
        boton.classList.toggle(
            "activo",
            boton.dataset.filtro === filtro
        );
    });

    mostrarTareas();
}

formulario.addEventListener("submit", agregarTarea);

listaTareas.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");

    if (!boton) return;

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "estado") {
        cambiarEstado(id);
    }

    if (accion === "eliminar") {
        eliminarTarea(id);
    }
});

filtros.forEach((boton) => {
    boton.addEventListener("click", () => {
        cambiarFiltro(boton.dataset.filtro);
    });
});

cargarTareas();
