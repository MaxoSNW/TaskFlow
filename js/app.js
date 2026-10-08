const formulario = document.getElementById("formulario-tarea");
const tituloTarea = document.getElementById("titulo-tarea");
const prioridadTarea = document.getElementById("prioridad-tarea");
const listaTareas = document.getElementById("lista-tareas");
const totalTareas = document.getElementById("total-tareas");
const pendientesTareas = document.getElementById("pendientes-tareas");
const completadasTareas = document.getElementById("completadas-tareas");
const filtros = document.querySelectorAll(".filtro");

let tareas = JSON.parse(localStorage.getItem("taskflow-tareas")) || [];
let filtroActual = "todas";

function guardarTareas() {
    localStorage.setItem("taskflow-tareas", JSON.stringify(tareas));
}

function generarId() {
    return Date.now();
}

function agregarTarea(evento) {
    evento.preventDefault();

    const titulo = tituloTarea.value.trim();

    if (!titulo) {
        return;
    }

    const nuevaTarea = {
    id: generarId(),
    titulo,
    prioridad: prioridadTarea.value,
    completada: false,
    fechaCreacion: new Date().toISOString()
    };

    tareas.push(nuevaTarea);

    guardarTareas();
    formulario.reset();

    prioridadTarea.value = "media";

    mostrarTareas();
}

function eliminarTarea(id) {
    const tarea = tareas.find((tarea) => tarea.id === id);

    if (!tarea) {
        return;
    }

    const confirmar = confirm(
        `¿Seguro que deseas eliminar la tarea "${tarea.titulo}"?`
    );

    if (!confirmar) {
        return;
    }

    tareas = tareas.filter((tarea) => tarea.id !== id);

    guardarTareas();
    mostrarTareas();
}

function cambiarEstado(id) {
    tareas = tareas.map((tarea) => {
        if (tarea.id === id) {
            return {
                ...tarea,
                completada: !tarea.completada
            };
        }

        return tarea;
    });

    guardarTareas();
    mostrarTareas();
}

function obtenerTareasFiltradas() {
    if (filtroActual === "pendientes") {
        return tareas.filter((tarea) => !tarea.completada);
    }

    if (filtroActual === "completadas") {
        return tareas.filter((tarea) => tarea.completada);
    }

    return tareas;
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "Fecha no disponible";
    }

    return new Date(fecha).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function crearElementoTarea(tarea) {
    const elemento = document.createElement("article");

    elemento.className = `tarea prioridad-${tarea.prioridad}`;

    if (tarea.completada) {
        elemento.classList.add("tarea-completada");
    }

    elemento.innerHTML = `
        <div class="tarea-info">
            <div class="tarea-titulo">${tarea.titulo}</div>
            <span class="tarea-prioridad">
            Prioridad: ${tarea.prioridad.toUpperCase()}
            </span>
            <span class="tarea-fecha">
            Creada: ${formatearFecha(tarea.fechaCreacion)}
            </span>
        </div>

        <div class="tarea-acciones">
            <button
                class="boton boton-secundario"
                data-accion="estado"
                data-id="${tarea.id}">
                ${tarea.completada ? "Reabrir" : "Completar"}
            </button>

            <button
                class="boton boton-eliminar"
                data-accion="eliminar"
                data-id="${tarea.id}">
                Eliminar
            </button>
        </div>
    `;

    return elemento;
}

function mostrarTareas() {
    const tareasFiltradas = obtenerTareasFiltradas();

    listaTareas.innerHTML = "";

    if (tareasFiltradas.length === 0) {
        listaTareas.innerHTML = `
            <div class="mensaje-vacio">
                <p>No hay tareas para mostrar.</p>
                <span>Agrega una nueva tarea para comenzar.</span>
            </div>
        `;
    } else {
        tareasFiltradas.forEach((tarea) => {
            listaTareas.appendChild(crearElementoTarea(tarea));
        });
    }

    const total = tareas.length;
    const completadas = tareas.filter((tarea) => tarea.completada).length;
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

    if (!boton) {
        return;
    }

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

mostrarTareas();