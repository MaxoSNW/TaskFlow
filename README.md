# TaskFlow

Aplicación web para la gestión y organización de tareas, desarrollada como proyecto académico de UVEG.

## 1. Descripción

TaskFlow es una aplicación web que permite administrar tareas mediante una interfaz sencilla, adaptable y fácil de utilizar. Su objetivo es facilitar la organización de actividades, la asignación de prioridades y el seguimiento de tareas pendientes y completadas.

### Funcionalidades principales

* Crear tareas.
* Asignar prioridades alta, media y baja.
* Marcar tareas como completadas.
* Reabrir tareas completadas.
* Eliminar tareas con confirmación.
* Filtrar tareas por estado.
* Consultar el total de tareas, las pendientes y las completadas.
* Mostrar la fecha y hora de creación de cada tarea.
* Guardar las tareas en el almacenamiento local del navegador mediante LocalStorage.

## 2. Tecnologías utilizadas

* HTML5 para la estructura.
* CSS3 para el diseño adaptable.
* JavaScript para la funcionalidad.
* LocalStorage para la persistencia local de las tareas.
* Git para el control de versiones.
* GitHub para alojar el repositorio.
* Apache HTTP Server, incluido en XAMPP, para servir la aplicación localmente.

## 3. Estructura del proyecto

```text
TaskFlow/
├── index.html
├── README.md
├── css/
│   ├── styles.css
│   └── styles.min.css
├── js/
│   ├── app.js
│   └── app.min.js
├── img/
├── documentacion/
└── reto-2/
    └── evidencias/
```

Los archivos originales `styles.css` y `app.js` se conservan para facilitar el mantenimiento. La aplicación utiliza las versiones minificadas `styles.min.css` y `app.min.js` para reducir el tamaño de los recursos descargados.

## 4. Ejecución local

### Opción A. Abrir directamente en el navegador

1. Descargar o clonar el repositorio.
2. Abrir el archivo `index.html` en un navegador compatible.

### Opción B. Ejecutar mediante Apache en Windows

1. Instalar y abrir XAMPP.
2. Iniciar el módulo Apache.
3. Configurar Apache para que tenga acceso a la carpeta del proyecto.
4. Abrir la siguiente dirección en el navegador:

   `http://localhost/TaskFlow`

En el entorno de desarrollo utilizado, Apache escucha en el puerto 80 y la ruta `/TaskFlow` apunta a la carpeta local del proyecto.

## 5. Optimización de recursos

Para reducir el tamaño de los archivos CSS y JavaScript se generaron versiones minificadas con las siguientes herramientas:

* `clean-css-cli` para CSS.
* `terser` para JavaScript.

Los archivos resultantes son:

* `css/styles.min.css`
* `js/app.min.js`

Los archivos originales se conservan para permitir futuras modificaciones.

## 6. Control de versiones

El proyecto utiliza Git y la rama principal `main`. El repositorio remoto se encuentra en:

https://github.com/MaxoSNW/TaskFlow

Para descargar el proyecto mediante Git:

```bash
git clone https://github.com/MaxoSNW/TaskFlow.git
```

Los cambios se registran mediante commits descriptivos para mantener un historial de desarrollo.

## 7. Persistencia de datos

Las tareas se guardan en LocalStorage del navegador. Por este motivo, los datos se mantienen después de recargar la página, pero pertenecen al almacenamiento del navegador y del origen utilizado. Las tareas no se sincronizan automáticamente entre navegadores, dispositivos o diferentes orígenes.

## 8. Preparación para despliegue

Como parte del Reto 2 se realizaron las siguientes actividades:

1. Organización de archivos y carpetas.
2. Minificación de CSS y JavaScript.
3. Creación y verificación de un archivo ZIP.
4. Inicialización del repositorio Git.
5. Registro de la versión inicial mediante un commit.
6. Publicación del proyecto en GitHub.
7. Configuración de Apache para acceder a TaskFlow mediante una URL local.
8. Comprobación del funcionamiento de la aplicación y de la persistencia de tareas después de recargar.

## 9. Proyecto académico

TaskFlow se desarrolla como parte de las actividades académicas de la Universidad Virtual del Estado de Guanajuato (UVEG). El proyecto se ampliará en las siguientes etapas para incorporar los requisitos de base de datos, seguridad y publicación simulada en tiendas de aplicaciones.
