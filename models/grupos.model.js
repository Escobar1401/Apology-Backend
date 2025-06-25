// Modelo de grupos y asignaciones de estudiantes

import db from "../config/db.js";

const gruposModel = {
    // Obtener todos los grupos con información del grado
    obtenerGrupos: (callback) => {
        const query = `
            SELECT g.id, g.nombre, gr.nombre as grado_nombre 
            FROM grupo g
            JOIN grado gr ON g.grado_id = gr.id
            ORDER BY gr.id, g.nombre`;
            
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener grupos:', err);
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
