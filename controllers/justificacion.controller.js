/* Controlador de justificaciones
Este es el controlador de justificaciones
*/

import justificacionModel from "../models/justificaciones.model.js"; // Importar el modelo de justificaciones
import db from "../config/db.js"; // Importar la conexión a la base de datos

const controller = {
    // Listar todas las justificaciones
    listarJustificaciones: (req, res) => {
        justificacionModel.obtenerJustificaciones((err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    
    // Listar una justificacion por ID
    obtenerJustificacion: (req, res) => {
        const id = req.params.id;
        justificacionModel.obtenerJustificacionPorId(id, (err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    
    // Crear una nueva justificacion
    crearJustificacion: (req, res) => {
        try {
            console.log('Creating justification...');
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            
            // Obtener los datos del formulario
            const { estudiante_id, fecha_inasistencia, materias, motivo, descripcion_adicional } = req.body;
            
            if (!estudiante_id || !fecha_inasistencia || !materias || !motivo) {
                console.error('Faltan campos requeridos en la solicitud');
                return res.status(400).json({
                    error: 'Faltan campos requeridos',
                    required: ['estudiante_id', 'fecha_inasistencia', 'materias', 'motivo']
                });
            }
            
            // Parsear el array de materias
            let materiasArray;
            try {
                materiasArray = JSON.parse(materias);
                if (!Array.isArray(materiasArray)) {
                    throw new Error('El campo materias debe ser un array');
                }
            } catch (e) {
                console.error('Error al parsear materias:', e);
                return res.status(400).json({
                    error: 'Formato de materias inválido',
                    details: e.message
                });
            }
            
            // Preparar los datos para la base de datos
            const justificacionData = {
                estudiante_id: parseInt(estudiante_id),
                fecha_ausencia: new Date(fecha_inasistencia),
                materias_afectadas: JSON.stringify(materiasArray), // Store as JSON string
                motivo,
                otro_motivo: motivo === 'Otro' ? descripcion_adicional : null,
                estado: 'Pendiente', // Must match enum in DB
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date()
            };

            // Si hay un archivo adjunto, guardar la ruta
            if (req.file) {
                console.log('Processing file upload:', req.file);
                justificacionData.archivo_adjunto = `/uploads/${req.file.filename}`;
            }

            console.log('Saving to database:', justificacionData);
            
            // Primero, obtener el ID del tutor legal del estudiante
            const getTutorQuery = 'SELECT tutor_legal_id FROM estudiante_tutor WHERE estudiante_id = ? LIMIT 1';
            
            db.query(getTutorQuery, [estudiante_id], (err, tutorResults) => {
                try {
                    if (err) {
                        console.error('Error al obtener el tutor legal:', err);
                        return res.status(500).json({
                            error: 'Error al obtener la información del tutor',
                            details: err.message
                        });
                    }
                    
                    // Si se encontró un tutor, agregar el ID a los datos de la justificación
                    if (tutorResults && tutorResults.length > 0) {
                        justificacionData.tutor_legal_id = tutorResults[0].tutor_legal_id;
                        console.log('Tutor legal encontrado:', justificacionData.tutor_legal_id);
                    } else {
                        console.warn('No se encontró un tutor legal para el estudiante:', estudiante_id);
                    }
                    
                    // Guardar en la base de datos
                    justificacionModel.crearJustificacion(justificacionData, (err, resultados) => {
                        if (err) {
                            console.error('Error al guardar en la base de datos:', err);
                            return res.status(500).json({ 
                                error: 'Error al guardar la justificación en la base de datos',
                                details: err.message,
                                code: err.code
                            });
                        }
                        
                        console.log('Justificación guardada exitosamente:', resultados);
                        
                        res.status(201).json({
                            success: true,
                            message: 'Justificación creada exitosamente',
                            data: {
                                id: resultados.insertId,
                                ...justificacionData
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error en crearJustificacion:', error);
                    res.status(500).json({
                        error: 'Error al procesar la solicitud',
                        details: error.message,
                        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                    });
                }
            });
        } catch (error) {
            console.error('Error en crearJustificacion (sincrónico):', error);
            res.status(500).json({
                error: 'Error al procesar la solicitud',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    },
    
    // Actualizar una justificacion
    actualizarJustificacion: (req, res) => {
        const id = req.params.id;
        const datos = req.body;
        justificacionModel.actualizarJustificacion(id, datos, (err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    
    // Eliminar una justificacion
    eliminarJustificacion: (req, res) => {
        const id = req.params.id;
        justificacionModel.eliminarJustificacion(id, (err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
}

export default controller;
