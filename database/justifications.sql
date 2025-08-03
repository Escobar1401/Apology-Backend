-- Tabla para almacenar las justificaciones de inasistencia
CREATE TABLE IF NOT EXISTS justificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    tutor_legal_id INT,
    fecha_inasistencia DATE NOT NULL,
    motivo TEXT NOT NULL,
    descripcion_adicional TEXT,
    archivo_ruta VARCHAR(255),
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_legal_id) REFERENCES usuario(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para la relación muchos a muchos entre justificaciones y materias
CREATE TABLE IF NOT EXISTS justificacion_materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    justificacion_id INT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (justificacion_id) REFERENCES justificaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_justificacion_materia (justificacion_id, materia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_justificaciones_estudiante ON justificaciones(estudiante_id);
CREATE INDEX idx_justificaciones_tutor ON justificaciones(tutor_legal_id);
CREATE INDEX idx_justificaciones_fecha ON justificaciones(fecha_inasistencia);
CREATE INDEX idx_justificaciones_estado ON justificaciones(estado);
