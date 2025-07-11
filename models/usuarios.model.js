// Modelo de usuarios

/*
En este archivo se definen las operaciones CRUD para los usuarios
*/

import db from "../config/db.js";

const usuariosModel = {
    obtenerUsuarios: (callback) => {
        const query = `
            SELECT 
                u.*,
                g.nombre AS nombre_grupo,
                gr.nombre AS nombre_grado
            FROM usuario u
            LEFT JOIN estudiante_grupo eg ON u.id = eg.estudiante_id AND u.rol = 'Estudiante'
            LEFT JOIN grupo g ON eg.grupo_id = g.id
            LEFT JOIN grado gr ON g.grado_id = gr.id
            ORDER BY u.apellidos, u.nombres
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                return callback(err);
            }
            
            // Procesar los resultados para agrupar la información de grupo y grado
            const usuariosProcesados = results.map(usuario => {
                if (usuario.rol === 'Estudiante') {
                    return {
                        ...usuario,
                        grupo: usuario.nombre_grupo ? `${usuario.nombre_grado} - ${usuario.nombre_grupo}` : 'Sin grupo asignado'
                    };
                }
                return usuario;
            });
            
            callback(null, usuariosProcesados);
        });
    },
    obtenerUsuarioPorId: (id, callback) => {
        const query = `
            SELECT 
                u.*,
                g.nombre AS nombre_grupo,
                gr.nombre AS nombre_grado
            FROM usuario u
            LEFT JOIN estudiante_grupo eg ON u.id = eg.estudiante_id AND u.rol = 'Estudiante'
            LEFT JOIN grupo g ON eg.grupo_id = g.id
            LEFT JOIN grado gr ON g.grado_id = gr.id
            WHERE u.id = ?
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener usuario por ID:', err);
                return callback(err);
            }
            
            if (results.length === 0) {
                return callback(null, []);
            }
            
            // Procesar el resultado para incluir la información del grupo si es estudiante
            const usuario = results[0];
            if (usuario.rol === 'Estudiante') {
                usuario.grupo = usuario.nombre_grupo ? 
                    `${usuario.nombre_grado} - ${usuario.nombre_grupo}` : 
                    'Sin grupo asignado';
            }
            
            callback(null, [usuario]);
        });
    },
    obtenerUsuarioPorRol: (rol, callback) => {
        const query = "SELECT * FROM usuario WHERE rol = ?";
        db.query(query, [rol], (err, results) => {
            if (err) {
                console.error('Error al obtener usuario por rol:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    crearUsuario: (usuario, callback) => {
        db.query("INSERT INTO usuario SET ?", usuario, (err, results) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
    actualizarUsuario: (id, usuario, callback) => {
        db.query("UPDATE usuario SET ? WHERE id = ?", [usuario, id], callback);
    },
    actualizarContrasena: (id, contrasena, callback) => {
        const sql = "UPDATE usuario SET contraseña = ? WHERE id = ?";
        db.query(sql, [contrasena, id], callback);
    },
    eliminarUsuario: (id, callback) => {
        db.query("DELETE FROM usuario WHERE id = ?", [id], callback);
    },
    actualizarDatosParciales: (id, campos, callback) => {
        const sets = [];
        const values = [];
        if (campos.correo) {
            sets.push('correo = ?');
            values.push(campos.correo);
        }
        if (campos.telefono) {
            sets.push('telefono = ?');
            values.push(campos.telefono);
        }
        if (sets.length === 0) return callback(null, null);
        values.push(id);
        const sql = `UPDATE usuario SET ${sets.join(', ')} WHERE id = ?`;
        db.query(sql, values, callback);
    }
};

export default usuariosModel;