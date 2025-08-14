/*
En este archivo se definen las operaciones CRUD para las justificaciones
*/

import db from "../config/db.js";

const justificacionesModel = {
    obtenerJustificaciones: (callback) => {
        const query = `
            SELECT j.*, u.nombres AS estudiante_nombres, u.apellidos AS estudiante_apellidos
            FROM justificaciones j
            JOIN usuario u ON j.estudiante_id = u.id
            ORDER BY 
                CASE j.estado 
                    WHEN 'Pendiente' THEN 1
                    WHEN 'Aprobada' THEN 2
                    WHEN 'Rechazada' THEN 3
                    ELSE 4
                END,
                j.fecha_creacion DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener justificaciones:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    obtenerJustificacionPorId: (id, callback) => {
        const query = "SELECT * FROM justificaciones WHERE id = ?";
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener justificacion por ID:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    crearJustificacion: (justificacion, callback) => {
        const query = "INSERT INTO justificaciones SET ?";
        db.query(query, justificacion, (err, results) => {
            if (err) {
                console.error('Error al crear justificacion:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    actualizarJustificacion: (id, justificacion, callback) => {
        const query = "UPDATE justificaciones SET ? WHERE id = ?";
        db.query(query, [justificacion, id], (err, results) => {
            if (err) {
                console.error('Error al actualizar justificacion:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    eliminarJustificacion: (id, callback) => {
        const query = "DELETE FROM justificaciones WHERE id = ?";
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al eliminar justificacion:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
}

export default justificacionesModel;
