/*
En este archivo se definen las operaciones de la base de datos.
*/

/* Crear la base de datos */
CREATE DATABASE IF NOT EXISTS apology;

/* Usar la base de datos */
USE apology;

/* Crear la tabla usuario*/
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    documento VARCHAR(10) UNIQUE NOT NULL, 
    nombres VARCHAR(100) NOT NULL, 
    apellidos VARCHAR(100) NOT NULL, 
    telefono VARCHAR(10) UNIQUE NOT NULL, 
    correo VARCHAR(200) UNIQUE NOT NULL, 
    contraseña VARCHAR(255) NOT NULL, 
    rol ENUM('Rector', 'Secretaria', 'Coordinador','Profesor','Estudiante','TutorLegal') NOT NULL, 
    estado VARCHAR(20) DEFAULT 'Activo', 
    intentosFallidos INT DEFAULT 0 
);

-- /* Insertar datos de prueba en Postman */
-- [
--   {
--     "documento": "0000000001",
--     "nombres": "Usuario",
--     "apellidos": "Secretaria",
--     "telefono": "0000000001",
--     "correo": "u.secretaria@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Us@",
--     "rol": "Secretaria"
--   },
--   {
--     "documento": "0000000002",
--     "nombres": "Usuario",
--     "apellidos": "Coordinador",
--     "telefono": "0000000002",
--     "correo": "u.coordinador@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Uc@",
--     "rol": "Coordinador"
--   },
--   {
--     "documento": "0000000003",
--     "nombres": "Usuario",
--     "apellidos": "Profesor",
--     "telefono": "0000000003",
--     "correo": "u.profesor@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Up@",
--     "rol": "Profesor"
--   },
--   {
--     "documento": "0000000004",
--     "nombres": "Usuario",
--     "apellidos": "Estudiante",
--     "telefono": "0000000004",
--     "correo": "u.estudiante@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Ue@",
--     "rol": "Estudiante"
--   },
--   {
--     "documento": "0000000005",
--     "nombres": "Usuario",
--     "apellidos": "TutorLegal",
--     "telefono": "0000000005",
--     "correo": "u.tutorlegal@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Ut@",
--     "rol": "TutorLegal"
--   },
--   {
--     "documento": "0000000006",
--     "nombres": "Usuario",
--     "apellidos": "Rector",
--     "telefono": "0000000006",
--     "correo": "u.rector@ieluiscarlosgalansarmiento.edu.co",
--     "contraseña": "0000000000Ur@",
--     "rol": "Rector"
--   }
-- ]

/* Crear la tabla grado */
CREATE TABLE grado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

/* Insertar datos en la tabla grado */
INSERT INTO grado (nombre) VALUES
('Transición'),
('1°'),
('2°'),
('3°'),
('4°'),
('5°'),
('6°'),
('7°'),
('8°'),
('9°'),
('10°'),
('11°');

/* Crear la tabla grupo */
CREATE TABLE grupo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    grado_id INT NOT NULL,
    FOREIGN KEY (grado_id) REFERENCES grado(id)
);

/* Insertar datos en la tabla grupo */
INSERT INTO grupo (nombre, grado_id) VALUES
('1A', 2), ('1B', 2),
('2A', 3), ('2B', 3),
('3A', 4), ('3B', 4),
('4A', 5), ('4B', 5),
('5A', 6), ('5B', 6),
('6A', 7), ('6B', 7),
('7A', 8), ('7B', 8),
('8A', 9), ('8B', 9),
('9A', 10), ('9B', 10),
('10A', 11), ('10B', 11),
('11A', 12), ('11B', 12);

/* Crear la tabla intermedia estudiante_grupo */
CREATE TABLE estudiante_grupo (
    estudiante_id INT PRIMARY KEY,
    grupo_id INT NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES usuario(id),
    FOREIGN KEY (grupo_id) REFERENCES grupo(id)
);

/* Verificar y agregar la columna resetPasswordToken si no existe */
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS resetPasswordToken VARCHAR(255) DEFAULT NULL;

/* Verificar y agregar la columna resetPasswordExpires si no existe */
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS resetPasswordExpires DATETIME DEFAULT NULL;

/* Verificar que las columnas se hayan agregado */
DESCRIBE usuario;