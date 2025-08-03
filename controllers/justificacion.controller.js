/* Controlador de justificaciones
Este es el controlador de justificaciones
*/

import justificacionController from "../models/justificaciones.model.js"; // Importar el controlador de justificaciones

const controller = {
    // Listar todas las justificaciones
    listarJustificaciones: (req, res) => {
        justificacionController.obtenerJustificaciones((err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    
    // Listar una justificacion por ID
    obtenerJustificacion: (req, res) => {
        const id = req.params.id;
        justificacionController.obtenerJustificacion(id, (err, resultados) => {
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
                estudiante_id,
                fecha_inasistencia: new Date(fecha_inasistencia),
                materias: materiasArray,
                motivo,
                estado: 'pendiente', // Estado inicial
                fecha_solicitud: new Date(),
                descripcion_adicional: descripcion_adicional || null
            };

            // Si hay un archivo adjunto, guardar la ruta
            if (req.file) {
                console.log('Processing file upload:', req.file);
                justificacionData.archivo_url = `/uploads/${req.file.filename}`;
                justificacionData.tipo_archivo = req.file.mimetype;
                justificacionData.nombre_archivo = req.file.originalname;
            }

            console.log('Saving to database:', justificacionData);
            
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
    },
    
    // Actualizar una justificacion
    actualizarJustificacion: (req, res) => {
        const id = req.params.id;
        const datos = req.body;
        justificacionController.actualizarJustificacion(id, datos, (err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
    
    // Eliminar una justificacion
    eliminarJustificacion: (req, res) => {
        const id = req.params.id;
        justificacionController.eliminarJustificacion(id, (err, resultados) => {
            if (err) return res.status(500).send(err);
            res.json(resultados);
        });
    },
}

export default controller;
