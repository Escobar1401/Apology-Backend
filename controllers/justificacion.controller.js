/* Controlador de justificaciones
Este es el controlador de justificaciones

Funcionalidades:
- Listar todas las justificaciones
- Obtener justificaciones por ID de estudiante
- Listar una justificacion por ID
- Crear una nueva justificacion
- Actualizar una justificacion
*/


import justificacionModel from "../models/justificaciones.model.js"; // Importar el modelo de justificaciones
import db from "../config/db.js"; // Importar la conexión a la base de datos

const controller = {
    // Listar todas las justificaciones
    listarJustificaciones: (req, res) => { // Listar todas las justificaciones
        justificacionModel.obtenerJustificaciones((err, resultados) => { // obtenerJustificaciones es una función que se encarga de obtener todas las justificaciones
            if (err) return res.status(500).send(err); // Si hay un error, retorna el error.
            res.json(resultados); // Retorna todas las justificaciones.
        });
    },
    
    // Obtener justificaciones por ID de estudiante
    obtenerJustificacionesPorEstudiante: (req, res) => { // Obtener justificaciones por ID de estudiante
        const estudianteId = req.params.estudianteId; // Obtener el ID del estudiante.
        if (!estudianteId) { // Si no se proporciona el ID del estudiante, retorna un error.
            return res.status(400).json({ error: 'Se requiere el ID del estudiante' }); // Retorna un error.
        }
        
        const query = `
            SELECT j.*, CONCAT(u.nombres, ' ', u.apellidos) as nombre_estudiante // Selecciona todas las justificaciones y el nombre del estudiante.
            FROM justificaciones j // Tabla de justificaciones.
            JOIN usuario u ON j.estudiante_id = u.id // Tabla de usuarios.
            WHERE j.estudiante_id = ? // Filtra por el ID del estudiante.
            ORDER BY // Ordena por el estado de la justificación.
                CASE j.estado // Ordena por el estado de la justificación.
                    WHEN 'Pendiente' THEN 1
                    WHEN 'Aprobada' THEN 2
                    WHEN 'Rechazada' THEN 3
                    ELSE 4
                END,
                j.fecha_creacion DESC // Ordena por la fecha de creación de la justificación.
        `;
        
        db.query(query, [estudianteId], (err, resultados) => { // Ejecuta la consulta.
            if (err) { // Si hay un error, retorna el error.
                console.error('Error al obtener justificaciones del estudiante:', err); // Retorna el error.
                return res.status(500).json({ // sirve para retornar un error.
                    error: 'Error al obtener las justificaciones', // Retorna el error en las justificaciones.
                    details: err.message // Retorna el error.
                }); 
            }
            
            // Parsear el campo materias_afectadas de JSON string a array
            const justificaciones = resultados.map(justificacion => ({  // Analiza el campo materias_afectadas de JSON string a array.
                ...justificacion, 
                materias_afectadas: JSON.parse(justificacion.materias_afectadas || '[]') // parsea el campo materias_afectadas de JSON string a array.
            }));
            
            res.json(justificaciones); // Retorna las justificaciones.
        });
    },
    
    // Listar una justificacion por ID
    obtenerJustificacion: (req, res) => { // Listar una justificacion por ID
        const id = req.params.id; // Obtiene el ID de la justificacion.
        justificacionModel.obtenerJustificacionPorId(id, (err, resultados) => { // Obtiene la justificacion por ID.
            if (err) return res.status(500).send(err); // Si hay un error, retorna el error.
            res.json(resultados); // Retorna la justificacion.
        });
    },
    
    // Crear una nueva justificacion
    crearJustificacion: (req, res) => { // Crear una nueva justificacion
        try { 
            console.log('Creating justification...'); // Muestra un mensaje en la consola.
            console.log('Request body:', req.body); // Muestra el cuerpo de la solicitud.
            console.log('Request file:', req.file); // Muestra el archivo de la solicitud.
            
            // Obtener los datos del formulario
            const { estudiante_id, fecha_inasistencia, materias, motivo, descripcion_adicional } = req.body; // Obtiene los datos del formulario.
            
            if (!estudiante_id || !fecha_inasistencia || !materias || !motivo) { // Si faltan datos, retorna un error.
                console.error('Faltan campos requeridos en la solicitud'); // Muestra un mensaje en la consola.
                return res.status(400).json({ // Retorna un error.
                    error: 'Faltan campos requeridos', // Retorna el error.
                    required: ['estudiante_id', 'fecha_inasistencia', 'materias', 'motivo'] // Retorna los campos requeridos.
                });
            }
            
            // Parsear el array de materias
            let materiasArray; // Declara la variable materiasArray.
            try {
                materiasArray = JSON.parse(materias); // Parsea el array de materias.
                if (!Array.isArray(materiasArray)) { // Si el array no es un array, retorna un error.
                    throw new Error('El campo materias debe ser un array'); // Retorna un error.
                }
            } catch (e) { 
                console.error('Error al parsear materias:', e); // Muestra un mensaje en la consola.
                return res.status(400).json({
                    error: 'Formato de materias inválido',
                    details: e.message
                });
            }
            
            // Preparar los datos para la base de datos
            const justificacionData = { // Prepara los datos para la base de datos.
                estudiante_id: parseInt(estudiante_id), // Convierte el ID del estudiante a entero.
                fecha_ausencia: new Date(fecha_inasistencia), // Convierte la fecha de ausencia a fecha de inasistencia.
                materias_afectadas: JSON.stringify(materiasArray), // Convierte el array de materias afectadas a JSON string.
                motivo, // Motivo de la justificación.
                otro_motivo: motivo === 'Otro' ? descripcion_adicional : null, // Si el motivo es otro retorna la descripción adicional.
                estado: 'Pendiente', // Must match enum in DB
                fecha_creacion: new Date(), // Fecha de creación.
                fecha_actualizacion: new Date() // Fecha de actualización.
            };

            // Si hay un archivo adjunto, guardar la ruta
            if (req.file) { // Si hay un archivo adjunto, guarda la ruta
                console.log('Processing file upload:', req.file); // Muestra el archivo adjunto.
                justificacionData.archivo_adjunto = `/uploads/${req.file.filename}`; // Guarda la ruta del archivo adjunto.
            }

            console.log('Saving to database:', justificacionData); // Muestra los datos de la justificación.
            
            // Primero, obtener el ID del tutor legal del estudiante
            const getTutorQuery = 'SELECT tutor_legal_id FROM estudiante_tutor WHERE estudiante_id = ? LIMIT 1'; // Obtiene el ID del tutor legal del estudiante.
            
            db.query(getTutorQuery, [estudiante_id], (err, tutorResults) => { // Obtiene el ID del tutor legal del estudiante.
                try {
                    if (err) {
                        console.error('Error al obtener el tutor legal:', err); // Muestra un mensaje en la consola.
                        return res.status(500).json({ // Retorna un error.
                            error: 'Error al obtener la información del tutor', // Retorna el error.
                            details: err.message // Retorna el error.
                        });
                    }
                    
                    // Si se encontró un tutor, agregar el ID a los datos de la justificación
                    if (tutorResults && tutorResults.length > 0) { // Si se encontró un tutor, agregar el ID a los datos de la justificación
                        justificacionData.tutor_legal_id = tutorResults[0].tutor_legal_id; // Agrega el ID del tutor legal a los datos de la justificación.
                        console.log('Tutor legal encontrado:', justificacionData.tutor_legal_id); // Muestra el ID del tutor legal y la justificación.
                    } else {
                        console.warn('No se encontró un tutor legal para el estudiante:', estudiante_id); // Muestra un mensaje en la consola.
                    }
                    
                    // Guardar en la base de datos
                    justificacionModel.crearJustificacion(justificacionData, (err, resultados) => { // Guarda la justificación en la base de datos.
                        if (err) { // Si hay un error, retorna el error.
                            console.error('Error al guardar en la base de datos:', err); // Muestra un mensaje en la consola.
                            return res.status(500).json({ // Retorna un error.
                                error: 'Error al guardar la justificación en la base de datos', // Retorna el error y muestra un mensaje en la consola.
                                details: err.message, // Retorna el error.
                                code: err.code // Retorna el error.
                            });
                        }
                        
                        console.log('Justificación guardada exitosamente:', resultados); // Muestra un mensaje en la consola de justificación guardada exitosamente.
                        
                        res.status(201).json({ // Retorna un mensaje de éxito.
                            success: true, // Retorna un mensaje de éxito.
                            message: 'Justificación creada exitosamente', // Retorna un mensaje de éxito.
                            data: { // Retorna los datos de la justificación.
                                id: resultados.insertId, // Retorna el ID de los resultados.
                                ...justificacionData // Retorna los datos de la justificación.
                            }
                        });
                    });
                } catch (error) { // Si hay un error, retorna el error.
                    console.error('Error en crearJustificacion:', error); // Muestra un mensaje en la consola.
                    res.status(500).json({ // Retorna un error.
                        error: 'Error al procesar la solicitud', // Muestra un mensaje en la consola.
                        details: error.message, // Retorna el error.
                        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Retorna el error.
                    }); // Retorna un error.
                }
            });
        } catch (error) { // Si hay un error, retorna el error.
            console.error('Error en crearJustificacion (sincrónico):', error); // Muestra un mensaje en la consola.
            res.status(500).json({ // Retorna un error.
                error: 'Error al procesar la solicitud', // Muestra un mensaje en la consola indicando el error.
                details: error.message, // Retorna el error.
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Retorna el error.
            });
        }
    },
    
    // Actualizar una justificacion
    actualizarJustificacion: (req, res) => { // Actualiza una justificacion.
        const id = req.params.id; // Obtiene el ID de la justificacion.
        const datos = req.body; // Obtiene los datos de la justificacion.
        
        // Primero obtener el estado actual de la justificación
        justificacionModel.obtenerJustificacionPorId(id, (err, justificacion) => { // Obtiene el estado actual de la justificacion.
            if (err) return res.status(500).send({ error: 'Error al verificar el estado de la justificación' }); // Si hay un error, retorna el error.
            
            if (!justificacion || justificacion.length === 0) { // Si no se encuentra la justificacion, retorna un error.
                return res.status(404).send({ error: 'Justificación no encontrada' }); // Si no se encuentra la justificacion, retorna un error.
            }
            
            // Verificar si la justificación está en estado 'Pendiente'
            if (justificacion[0].estado !== 'Pendiente') { // Si la justificacion no esta en estado 'Pendiente', retorna un error.
                return res.status(400).send({ // Retorna un error.
                    error: 'Solo se pueden modificar justificaciones con estado Pendiente' // Retorna un error y muestra un mensaje en la consola.
                });
            }
            
            // Si está pendiente, proceder con la actualización
            justificacionModel.actualizarJustificacion(id, datos, (err, resultados) => { // Actualiza la justificacion.
                if (err) return res.status(500).send({ error: 'Error al actualizar la justificación' }); // Si hay un error, retorna el error.
                res.json(resultados); // Retorna la justificacion actualizada.
            });
        });
    },
    
    // Eliminar una justificacion
    eliminarJustificacion: (req, res) => { // Elimina la justificacion.
        const id = req.params.id; // Obtiene el ID de la justificacion.
        justificacionModel.eliminarJustificacion(id, (err, resultados) => { // Elimina la justificacion y retorna los resultados.
            if (err) return res.status(500).send(err); // Si hay un error, retorna el error.
            res.json(resultados); // Retorna la justificacion eliminada.
        });
    },
}

export default controller; // Exporta el controlador de justificaciones.
