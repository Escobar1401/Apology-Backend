/*
En este archivo se definen los middlewares para las justificaciones
*/

const validarJustificacion = (req, res, next) => {
    try {
        console.log('Validating justification request...');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        // Obtener los campos del formulario
        const { estudiante_id, fecha_inasistencia, materias, motivo } = req.body;
        
        // Validar campos requeridos
        if (!estudiante_id) {
            console.error('Falta el ID del estudiante');
            return res.status(400).json({ error: 'El ID del estudiante es requerido' });
        }
        
        if (!fecha_inasistencia) {
            console.error('Falta la fecha de inasistencia');
            return res.status(400).json({ error: 'La fecha de inasistencia es requerida' });
        }
        
        // Validar que materias sea un array JSON válido
        let materiasArray = [];
        try {
            materiasArray = materias ? JSON.parse(materias) : [];
            if (!Array.isArray(materiasArray) || materiasArray.length === 0) {
                console.error('No se seleccionaron materias');
                return res.status(400).json({ error: 'Debe seleccionar al menos una materia' });
            }
        } catch (e) {
            console.error('Error al parsear materias:', e);
            return res.status(400).json({ 
                error: 'Formato de materias inválido',
                details: e.message 
            });
        }
        
        if (!motivo) {
            console.error('Falta el motivo');
            return res.status(400).json({ error: 'El motivo es requerido' });
        }
        
        // Validar formato de fecha
        const fecha = new Date(fecha_inasistencia);
        if (isNaN(fecha.getTime())) {
            console.error('Formato de fecha inválido:', fecha_inasistencia);
            return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        
        // Si hay un archivo, validar su tipo
        if (req.file) {
            const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
            if (!tiposPermitidos.includes(req.file.mimetype)) {
                console.error('Tipo de archivo no permitido:', req.file.mimetype);
                return res.status(400).json({ 
                    error: 'Tipo de archivo no permitido. Solo se aceptan PDF, JPG o PNG',
                    receivedType: req.file.mimetype
                });
            }
        }
        
        console.log('Validation passed');
        // Si todo está bien, continuar
        next();
    } catch (error) {
        console.error('Error en la validación:', error);
        return res.status(500).json({ 
            error: 'Error al validar los datos de la justificación',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export default validarJustificacion;
