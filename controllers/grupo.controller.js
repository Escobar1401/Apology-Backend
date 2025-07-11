/* Controlador para manejar las operaciones relacionadas con grupos
En este archivo se definen las operaciones de grupos.
Este código sirve para que el usuario pueda iniciar sesión, verificar si un correo existe,
solicitar recuperación de contraseña, validar el token de recuperación y restablecer la contraseña.
*/

import gruposModel from "../models/grupos.model.js";

// Controlador para manejar las operaciones relacionadas con grupos
export default {

    // Obtener todos los grupos
    listarGrupos: (req, res) => {
        gruposModel.obtenerGrupos((err, results) => {
            if (err) {
                console.error('Error al obtener grupos:', err);
                return res.status(500).json({
                    mensaje: 'Error al obtener los grupos',
                    error: err
                });
            }
            res.json(results);
        });
    },
    
    // Obtener todos los grados
    listarGrados: (req, res) => {
        gruposModel.obtenerGrados((err, results) => {
            if (err) {
                console.error('Error al obtener grados:', err);
                return res.status(500).json({
                    mensaje: 'Error al obtener los grados',
                    error: err
                });
            }
            res.json(results);
        });
    },

    // Obtener grupos por grado
    obtenerGruposPorGrado: (req, res) => {
        const { gradoId } = req.params;
        
        if (!gradoId) {
            return res.status(400).json({
                mensaje: 'Se requiere el ID del grado'
            });
        }
        
        gruposModel.obtenerGruposPorGrado(gradoId, (err, results) => {
            if (err) {
                console.error('Error al obtener grupos por grado:', err);
                return res.status(500).json({
                    mensaje: 'Error al obtener los grupos del grado',
                    error: err
                });
            }
            res.json(results);
        });
    },

    // Obtener estudiantes por grupo
    obtenerEstudiantesPorGrupo: (req, res) => {
        const { grupoId } = req.params;
        
        if (!grupoId) {
            return res.status(400).json({
                mensaje: 'Se requiere el ID del grupo'
            });
        }
        
        gruposModel.obtenerEstudiantesPorGrupo(grupoId, (err, results) => {
            if (err) {
                console.error('Error al obtener estudiantes del grupo:', err);
                return res.status(500).json({
                    mensaje: 'Error al obtener los estudiantes del grupo',
                    error: err
                });
            }
            res.json(results);
        });
    },

    // Asignar un estudiante a un grupo
    asignarEstudiante: (req, res) => {
        const { estudiante_id, grupo_id } = req.body;

        // Validar que se proporcionen los datos necesarios
        if (!estudiante_id || !grupo_id) {
            return res.status(400).json({
                mensaje: 'Se requieren tanto el ID del estudiante como el ID del grupo'
            });
        }

        // Verificar si el estudiante ya está en un grupo
        gruposModel.verificarAsignacion(estudiante_id, (err, existeAsignacion) => {
            if (err) {
                console.error('Error al verificar asignación:', err);
                return res.status(500).json({
                    mensaje: 'Error al verificar la asignación del estudiante',
                    error: err
                });
            }

            if (existeAsignacion) {
                return res.status(400).json({
                    mensaje: 'El estudiante ya está asignado a un grupo'
                });
            }

            // Si no está asignado, proceder con la asignación
            gruposModel.asignarEstudianteAGrupo(estudiante_id, grupo_id, (err, results) => {
                if (err) {
                    console.error('Error al asignar estudiante a grupo:', err);
                    return res.status(500).json({
                        mensaje: 'Error al asignar el estudiante al grupo',
                        error: err
                    });
                }

                res.status(201).json({
                    mensaje: 'Estudiante asignado al grupo correctamente',
                    estudiante_id,
                    grupo_id
                });
            });
        });
    }
};
