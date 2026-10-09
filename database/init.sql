CREATE DATABASE IF NOT EXISTS taskflow_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE taskflow_db;

CREATE TABLE IF NOT EXISTS tareas (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(200) NOT NULL,
prioridad ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
completada BOOLEAN NOT NULL DEFAULT FALSE,
fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,
INDEX idx_tareas_completada (completada),
INDEX idx_tareas_prioridad (prioridad)
);
