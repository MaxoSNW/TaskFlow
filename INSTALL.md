# Guía de instalación de TaskFlow

## 1. Descripción

TaskFlow es una aplicación web para gestionar tareas. Permite crear tareas, asignar prioridades, consultar su estado, marcarlas como completadas, reabrirlas y eliminarlas.

La aplicación utiliza Node.js y Express para el servidor y una base de datos MySQL para almacenar la información.

## 2. Requisitos previos

Antes de instalar el proyecto, se requiere:

- Node.js v24.21.0.
- npm v11.19.0.
- MySQL Server compatible con el esquema de la aplicación.
- Git, si se desea clonar el repositorio.
- PowerShell en Windows o una terminal equivalente.

## 3. Tecnologías y dependencias

| Tecnología o paquete | Versión registrada | Propósito |
|---|---|---|
| Node.js | 24.21.0 | Entorno de ejecución de JavaScript |
| npm | 11.19.0 | Administración de paquetes |
| Express | 5.2.1 | Servidor web y API REST |
| mysql2 | 3.24.5 | Conexión entre Node.js y MySQL |
| dotenv | 18.0.6 | Carga de variables de entorno |
| Helmet | 8.3.0 | Configuración de cabeceras HTTP de seguridad |
| nodemon | 3.1.14 | Reinicio automático durante el desarrollo |

Las versiones de paquetes indicadas corresponden a las versiones declaradas en el proyecto. Para conocer la versión exacta instalada, se puede ejecutar `npm ls`.

## 4. Obtener el proyecto

Si se utiliza Git, ejecutar:

```powershell
git clone https://github.com/MaxoSNW/TaskFlow.git
cd TaskFlow
```

Si el proyecto ya está descargado, abrir PowerShell en su carpeta raíz.

## 5. Instalar dependencias

Ejecutar:

```powershell
npm install
```

Este comando instala los paquetes necesarios definidos en `package.json`.

## 6. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto a partir de `.env.example`.

Configurar las siguientes variables con los valores correspondientes al entorno local:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA_LOCAL
DB_NAME=taskflow_db
PORT=3000
```

Reemplazar `TU_CONTRASEÑA_LOCAL` por la contraseña configurada para el usuario MySQL. No publicar el archivo `.env` ni compartir sus credenciales.

## 7. Crear la base de datos

Verificar que el servicio MySQL esté iniciado. Desde PowerShell, ejecutar el script de inicialización:

```powershell
Get-Content .\database\init.sql -Raw | mysql -u root -p
```

Introducir la contraseña de MySQL cuando se solicite.

El script debe crear la base de datos y la tabla necesarias para almacenar las tareas. Si se utiliza otro usuario, adaptar el comando y los permisos según la configuración local.

## 8. Ejecutar la aplicación

Para iniciar el servidor en modo de desarrollo:

```powershell
npm run dev
```

Para iniciarlo sin nodemon:

```powershell
npm start
```

Cuando el servidor esté iniciado, abrir:

http://localhost:3000

## 9. Verificar la conexión

Comprobar el estado del servidor y de la base de datos en:

http://localhost:3000/api/health

También se pueden consultar las tareas mediante:

http://localhost:3000/api/tareas

Una respuesta correcta del endpoint de salud debe indicar que el servidor está operativo y que la base de datos está conectada.

## 10. Solución de problemas

- **El puerto 3000 está ocupado:** comprobar qué proceso utiliza el puerto o modificar `PORT` en `.env`.
- **No conecta con MySQL:** verificar que el servicio esté iniciado y que las credenciales de `.env` sean correctas.
- **Faltan dependencias:** ejecutar `npm install`.
- **La interfaz no carga las tareas:** comprobar que Express siga ejecutándose y revisar la conexión con `/api/health`.

## 11. Seguridad

El archivo `.env` contiene credenciales y no debe incluirse en Git. Para producción, utilizar un usuario de base de datos con permisos limitados en lugar de una cuenta administrativa, configurar HTTPS y revisar las cabeceras de seguridad y los permisos del servidor.
