// Modelo para manejar operaciones relacionadas con grupos, grados y estudiantes

import db from "../config/db.js";

const gruposModel = {
    // Obtener todos los grupos
    obtenerGrupos: (callback) => {
        const query = `
        SELECT id, nombre 
        FROM grupo 
        ORDER BY id
    `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener grupos:', err);
                return callback(err);
            }
            callback(null, results);
        });
    }   ,

    // Obtener todos los grados
    obtenerGrados: (callback) => {
        const query = `
            SELECT id, nombre 
            FROM grado 
            ORDER BY id`;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener grados:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Obtener grupos por grado
    obtenerGruposPorGrado: (gradoId, callback) => {
        const query = `
            SELECT id, nombre 
            FROM grupo 
            WHERE grado_id = ?
            ORDER BY nombre`;

        db.query(query, [gradoId], (err, results) => {
            if (err) {
                console.error('Error al obtener grupos por grado:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Obtener estudiantes por grupo
    obtenerEstudiantesPorGrupo: (grupoId, callback) => {
        const query = `
            SELECT u.id, u.documento, u.nombres, u.apellidos, u.correo, u.rol, u.telefono, u.estado
            FROM usuario u
            JOIN estudiante_grupo eg ON u.id = eg.estudiante_id
            JOIN grupo g ON eg.grupo_id = g.id
            WHERE eg.grupo_id = ? AND u.rol = 'Estudiante'
            ORDER BY u.apellidos, u.nombres`;

        db.query(query, [grupoId], (err, results) => {
            if (err) {
                console.error('Error al obtener estudiantes del grupo:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Asignar un estudiante a un grupo
    asignarEstudianteAGrupo: (estudianteId, grupoId, callback) => {
        const query = 'INSERT INTO estudiante_grupo (estudiante_id, grupo_id) VALUES (?, ?)';
        db.query(query, [estudianteId, grupoId], (err, results) => {
            if (err) {
                console.error('Error al asignar estudiante a grupo:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Verificar si un estudiante ya está en un grupo
    verificarAsignacion: (estudianteId, callback) => {
        const query = 'SELECT * FROM estudiante_grupo WHERE estudiante_id = ?';
        db.query(query, [estudianteId], (err, results) => {
            if (err) {
                console.error('Error al verificar asignación:', err);
                return callback(err);
            }
            callback(null, results.length > 0);
        });
    }
};

export default gruposModel;
