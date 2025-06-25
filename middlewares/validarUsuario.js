// Middleware para validar los datos del usuario

/*
En este archivo se definen las validaciones para los datos del usuario
*/

import connection from "../config/db.js"; // Importar la conexión a la base de datos


export default function validarUsuario(req, res, next) {
    // Validar que se envíe un cuerpo en la solicitud
    if (!req.body) {
        return res.status(400).json({ mensaje: '‼️ No se recibió ningún cuerpo en la solicitud.' });
    }

    // Extraer los datos del cuerpo
    const { documento, nombres, apellidos, telefono, correo, contraseña } = req.body;

    // Validaciones iniciales
    if (!documento || !nombres || !apellidos || !telefono || !correo || !contraseña) {
        return res.status(400).json({ mensaje: '‼️ Todos los campos son obligatorios.' });
    }

    // Validar documento
    if (isNaN(parseInt(documento))) {
        return res.status(400).json({ mensaje: '‼️ El documento debe contener solo números.' });
    }

    if (!/^[0-9]{7,10}$/.test(documento.toString())) {
        return res.status(400).json({ mensaje: '‼️ El documento debe tener entre 7 y 10 dígitos numéricos.' });
    }

    // Validar nombres
    if (!/^[A-Za-zÁÉÍÓÚáéíóúüÜ ]+$/.test(nombres)) {
        return res.status(400).json({ mensaje: '‼️ Los nombres solo pueden contener letras y espacios.' });
    }

    if (nombres.length < 3 || nombres.length > 100) {
        return res.status(400).json({ mensaje: '‼️ Los nombres deben tener al menos 3 caracteres y máximo 100.' });
    }

    // Validar apellidos
    if (!/^[A-Za-zÁÉÍÓÚáéíóúüÜ ]+$/.test(apellidos)) {
        return res.status(400).json({ mensaje: '‼️ Los apellidos solo pueden contener letras y espacios.' });
    }

    if (apellidos.length < 3 || apellidos.length > 100) {
        return res.status(400).json({ mensaje: '‼️ Los apellidos deben tener al menos 3 caracteres y máximo 100.' });
    }

    // Validar teléfono
    if (!/^[0-9]{10}$/.test(telefono)) {
        return res.status(400).json({
            mensaje: '‼️ El teléfono debe tener exactamente 10 dígitos numéricos.'
        });
    }

    // Validar correo
    if (!/^[\w-.]+@ieluiscarlosgalansarmiento\.edu\.co$/.test(correo)) {
        return res.status(400).json({ mensaje: '‼️ Correo electrónico inválido, debe tener un formato válido (@ieluiscarlosgalansarmiento.edu.co).' });
    }

    if (correo.length < 3 || correo.length > 200) {
        return res.status(400).json({ mensaje: '‼️ El correo electrónico debe tener al menos 3 caracteres y máximo 200.' });
    }

    // Validar contraseña
    const requirements = {
        length: contraseña.length >= 8,
        lowercase: /[a-z]/.test(contraseña),
        uppercase: /[A-Z]/.test(contraseña),
        number: /\d/.test(contraseña),
        special: /[@$!%*?&]/.test(contraseña)
    };

    const missingRequirements = [];
    if (!requirements.length) missingRequirements.push('al menos 8 caracteres');
    if (!requirements.lowercase) missingRequirements.push('una letra minúscula');
    if (!requirements.uppercase) missingRequirements.push('una letra mayúscula');
    if (!requirements.number) missingRequirements.push('un número');
    if (!requirements.special) missingRequirements.push('un carácter especial (@$!%*?&)');

    if (missingRequirements.length > 0) {
        return res.status(400).json({
            mensaje: '‼️ La contraseña no cumple con los requisitos mínimos. La contraseña debe contener ' + missingRequirements.join(', '),
        });
    }

    // Verificar duplicados en la base de datos
    const queries = [
        { query: 'SELECT * FROM usuario WHERE documento = ?', params: [documento] },
        { query: 'SELECT * FROM usuario WHERE telefono = ?', params: [telefono] },
        { query: 'SELECT * FROM usuario WHERE correo = ?', params: [correo] }
    ];

    let completedQueries = 0;
    let hasError = false;

    queries.forEach(({ query, params }) => {
        connection.query(query, params, (err, filas) => {
            if (hasError) return; // Evita múltiples respuestas
            // Manejar errores de la consulta
            if (err) {
                hasError = true; // Marcar como error
                return res.status(500).json(err);
            } else if (filas.length > 0) { // Verificar si ya existe el usuario
                hasError = true; // Marcar como error
                return res.status(400).json({ mensaje: '‼️ El ' + (query.includes('documento') ? 'documento' : query.includes('telefono') ? 'teléfono' : 'correo') + ' ya existe en la base de datos.' });
            }
            completedQueries++;
            // Verificar si todas las consultas han sido completadas
            if (completedQueries === queries.length && !hasError) {
                next();
            }
        });
    });
};