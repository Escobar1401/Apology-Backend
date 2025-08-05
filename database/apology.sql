-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-08-2025 a las 05:47:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `apology`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_grupo`
--

CREATE TABLE `estudiante_grupo` (
  `estudiante_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante_grupo`
--

INSERT INTO `estudiante_grupo` (`estudiante_id`, `grupo_id`) VALUES
(2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_tutor`
--

CREATE TABLE `estudiante_tutor` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `tutor_legal_id` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante_tutor`
--

INSERT INTO `estudiante_tutor` (`id`, `estudiante_id`, `tutor_legal_id`, `fecha_asignacion`) VALUES
(1, 2, 4, '2025-08-03 01:00:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grado`
--

INSERT INTO `grado` (`id`, `nombre`) VALUES
(11, '10°'),
(12, '11°'),
(2, '1°'),
(3, '2°'),
(4, '3°'),
(5, '4°'),
(6, '5°'),
(7, '6°'),
(8, '7°'),
(9, '8°'),
(10, '9°'),
(1, 'Transición');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `grado_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id`, `nombre`, `grado_id`) VALUES
(1, '1A', 2),
(2, '1B', 2),
(3, '2A', 3),
(4, '2B', 3),
(5, '3A', 4),
(6, '3B', 4),
(7, '4A', 5),
(8, '4B', 5),
(9, '5A', 6),
(10, '5B', 6),
(11, '6A', 7),
(12, '6B', 7),
(13, '7A', 8),
(14, '7B', 8),
(15, '8A', 9),
(16, '8B', 9),
(17, '9A', 10),
(18, '9B', 10),
(19, '10A', 11),
(20, '10B', 11),
(21, '11A', 12),
(22, '11B', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `justificaciones`
--

CREATE TABLE `justificaciones` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `tutor_legal_id` int(11) DEFAULT NULL,
  `fecha_ausencia` date NOT NULL,
  `motivo` enum('Enfermedad','Cita médica','Problemas familiares','Otro') NOT NULL,
  `otro_motivo` varchar(255) DEFAULT NULL,
  `materias_afectadas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`materias_afectadas`)),
  `archivo_adjunto` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`id`, `nombre`, `fecha_creacion`) VALUES
(1, 'Matemáticas', '2025-08-03 01:11:16'),
(2, 'Lengua Castellana', '2025-08-03 01:11:16'),
(3, 'Ciencias Naturales', '2025-08-03 01:11:16'),
(4, 'Ciencias Sociales', '2025-08-03 01:11:16'),
(5, 'Inglés', '2025-08-03 01:11:16'),
(6, 'Educación Física', '2025-08-03 01:11:16'),
(7, 'Educación Artística', '2025-08-03 01:11:16'),
(8, 'Ética y Valores', '2025-08-03 01:11:16'),
(9, 'Tecnología e Informática', '2025-08-03 01:11:16'),
(10, 'Filosofía', '2025-08-03 01:11:16'),
(11, 'Química', '2025-08-03 01:11:16'),
(12, 'Física', '2025-08-03 01:11:16'),
(13, 'Biología', '2025-08-03 01:11:16'),
(14, 'Educación Religiosa', '2025-08-03 01:11:16'),
(15, 'Emprendimiento', '2025-08-03 01:11:16'),
(16, 'Ciencias Políticas', '2025-08-03 01:11:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `documento` varchar(10) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('Rector','Secretaria','Coordinador','Profesor','Estudiante','TutorLegal') NOT NULL,
  `estado` varchar(20) DEFAULT 'Activo',
  `intentosFallidos` int(11) DEFAULT 0,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `documento`, `nombres`, `apellidos`, `telefono`, `correo`, `contraseña`, `rol`, `estado`, `intentosFallidos`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(1, '0000000001', 'Usuario', 'Secretaria', '0000000001', 'u.secretaria@ieluiscarlosgalansarmiento.edu.co', '$2b$10$JJoB1HKGQw0mYWfmOL5SYuDt8qW7gmqqX0Vm8HJifg9SzzdtTicT.', 'Secretaria', 'Activo', 0, NULL, NULL),
(2, '1000000001', 'Usuario Estudiante', 'Asignado', '1000000001', 'uaestudiante@ieluiscarlosgalansarmiento.edu.co', '$2b$10$U37hWka4Pj4tH6KI3rDWmutMKeReibyP9JKRSeVLWZw.K3Q6vjNiK', 'Estudiante', 'Activo', 0, NULL, NULL),
(4, '2000000001', 'Usuario Tutor', 'Asignado', '2000000001', 'uatutor@ieluiscarlosgalansarmiento.edu.co', '$2b$10$7EfOf4DvkiVi4bX5JCbTT.EpPbCOFYmbjoF5X5cW5PUKcLIWRH5Y2', 'TutorLegal', 'Activo', 0, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiante_grupo`
--
ALTER TABLE `estudiante_grupo`
  ADD PRIMARY KEY (`estudiante_id`),
  ADD KEY `grupo_id` (`grupo_id`);

--
-- Indices de la tabla `estudiante_tutor`
--
ALTER TABLE `estudiante_tutor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_estudiante_tutor` (`estudiante_id`,`tutor_legal_id`),
  ADD KEY `idx_estudiante_id` (`estudiante_id`),
  ADD KEY `idx_tutor_legal_id` (`tutor_legal_id`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grado_id` (`grado_id`);

--
-- Indices de la tabla `justificaciones`
--
ALTER TABLE `justificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_justificacion_estudiante` (`estudiante_id`),
  ADD KEY `idx_justificacion_tutor` (`tutor_legal_id`),
  ADD KEY `idx_justificacion_fecha` (`fecha_ausencia`),
  ADD KEY `idx_justificacion_estado` (`estado`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nombre` (`nombre`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiante_tutor`
--
ALTER TABLE `estudiante_tutor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `grado`
--
ALTER TABLE `grado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `justificaciones`
--
ALTER TABLE `justificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estudiante_grupo`
--
ALTER TABLE `estudiante_grupo`
  ADD CONSTRAINT `estudiante_grupo_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `estudiante_grupo_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupo` (`id`);

--
-- Filtros para la tabla `estudiante_tutor`
--
ALTER TABLE `estudiante_tutor`
  ADD CONSTRAINT `estudiante_tutor_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `estudiante_tutor_ibfk_2` FOREIGN KEY (`tutor_legal_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `grupo_ibfk_1` FOREIGN KEY (`grado_id`) REFERENCES `grado` (`id`);

--
-- Filtros para la tabla `justificaciones`
--
ALTER TABLE `justificaciones`
  ADD CONSTRAINT `justificaciones_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `justificaciones_ibfk_2` FOREIGN KEY (`tutor_legal_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
