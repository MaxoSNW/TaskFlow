\# Configuración del servidor Apache para TaskFlow



\## 1. Objetivo



Configurar Apache HTTP Server para servir la aplicación web TaskFlow desde una carpeta local de Windows, utilizando una ruta de acceso sencilla desde el navegador.



\## 2. Entorno utilizado



\* Sistema operativo: Windows.

\* Servidor web: Apache HTTP Server.

\* Distribución utilizada: XAMPP 8.2.12.

\* Puerto HTTP: 80.

\* Carpeta del proyecto: `C:/ProyectosUveg/TaskFlow`.

\* URL local: `http://localhost/TaskFlow`.



\## 3. Archivo de configuración



El archivo editado fue:



`C:\\xampp\\apache\\conf\\extra\\httpd-vhosts.conf`



En este archivo se agregó el siguiente bloque:



```apache

\# TaskFlow - acceso local para el Reto 2

<VirtualHost \*:80>

&#x20;   ServerName localhost



&#x20;   Alias /TaskFlow "C:/ProyectosUveg/TaskFlow"



&#x20;   <Directory "C:/ProyectosUveg/TaskFlow">

&#x20;       Options -Indexes +FollowSymLinks

&#x20;       AllowOverride All

&#x20;       Require all granted

&#x20;   </Directory>

</VirtualHost>

```



\## 4. Descripción de los parámetros



\* `VirtualHost \*:80`: configura el bloque para atender solicitudes HTTP en el puerto 80.

\* `ServerName localhost`: establece el nombre local utilizado por el servidor.

\* `Alias /TaskFlow`: relaciona la ruta web `/TaskFlow` con la carpeta física del proyecto.

\* `Options -Indexes +FollowSymLinks`: desactiva la generación de listados de directorios y permite seguir enlaces simbólicos.

\* `AllowOverride All`: permite que los archivos `.htaccess` establezcan directivas autorizadas por Apache.

\* `Require all granted`: permite el acceso a los recursos de ese directorio mediante las reglas de Apache.



\## 5. Verificación



Después de modificar la configuración, se verificó su sintaxis mediante el comando:



`C:\\xampp\\apache\\bin\\httpd.exe -t`



El resultado obtenido fue:



`Syntax OK`



Posteriormente, se reinició Apache desde el panel de control de XAMPP y se comprobó que la aplicación estuviera disponible en:



`http://localhost/TaskFlow`



También se creó una tarea de prueba y se recargó la página para comprobar su persistencia en el almacenamiento local del navegador.



\## 6. Resultado



La configuración permite acceder a TaskFlow desde el servidor Apache local sin tener que abrir directamente el archivo HTML desde el explorador de archivos. Esto facilita las pruebas de funcionamiento y demuestra la configuración de una ruta web local para el proyecto.



\*\*Nota:\*\* esta configuración está destinada al entorno local de desarrollo y no constituye, por sí sola, una configuración completa para publicar la aplicación en Internet.



